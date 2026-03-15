import asyncio
import logging
from typing import List, Optional

import httpx

from backend.models import ProductResponse
from backend.services.base import BaseMarketplace

logger = logging.getLogger(__name__)


class VintedService(BaseMarketplace):
    name = "vinted"
    display_name = "Vinted"
    color = "#8b5cf6"

    def __init__(self):
        self.base_url = "https://www.vinted.it"
        self.api_url = "https://www.vinted.it/api/v2/catalog/items"
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        self.cookies: Optional[dict] = None

    async def _refresh_cookies(self) -> None:
        try:
            async with httpx.AsyncClient(
                headers=self.headers, follow_redirects=True, timeout=10.0
            ) as client:
                resp = await client.get(self.base_url)
                self.cookies = dict(resp.cookies)
                logger.info("Vinted cookies refreshed")
        except Exception:
            logger.warning("Could not refresh Vinted cookies", exc_info=True)

    async def _fetch_page(
        self,
        client: httpx.AsyncClient,
        keyword: str,
        page: int,
        min_price: Optional[float],
        max_price: Optional[float],
    ) -> List[dict]:
        params: dict = {
            "search_text": keyword,
            "order": "price_low_to_high",
            "page": page,
            "per_page": 48,
        }
        # Let Vinted filter server-side — far more accurate than post-filtering
        if min_price is not None:
            params["price_from"] = min_price
        if max_price is not None:
            params["price_to"] = max_price

        resp = await client.get(self.api_url, params=params)
        resp.raise_for_status()
        return resp.json().get("items", [])

    async def search(
        self,
        keyword: str,
        max_price: Optional[float] = None,
        condition: Optional[str] = None,
        min_price: Optional[float] = None,
        pages: int = 2,
    ) -> List[ProductResponse]:
        if not self.cookies:
            await self._refresh_cookies()

        raw_items: List[dict] = []

        for attempt in range(2):
            try:
                async with httpx.AsyncClient(
                    headers=self.headers, cookies=self.cookies, timeout=15.0
                ) as client:
                    tasks = [
                        self._fetch_page(client, keyword, p, min_price, max_price)
                        for p in range(1, pages + 1)
                    ]
                    pages_data = await asyncio.gather(*tasks, return_exceptions=True)

                for page_result in pages_data:
                    if isinstance(page_result, Exception):
                        logger.warning("Vinted page fetch error: %s", page_result)
                        continue
                    raw_items.extend(page_result)
                break

            except httpx.HTTPStatusError as exc:
                if exc.response.status_code == 401 and attempt == 0:
                    logger.info("Vinted 401 — refreshing cookies and retrying")
                    self.cookies = None
                    await self._refresh_cookies()
                    continue
                logger.error("Vinted API HTTP error: %s", exc)
                return []
            except Exception:
                logger.exception("Unexpected error in VintedService.search")
                return []

        seen_ids: set = set()
        results: List[ProductResponse] = []

        for item in raw_items:
            item_id = str(item.get("id"))
            if item_id in seen_ids:
                continue
            seen_ids.add(item_id)

            price_val = item.get("price")
            if isinstance(price_val, dict):
                price = float(price_val.get("amount") or price_val.get("numeric") or 0)
                currency = price_val.get("currency_code", "€")
            else:
                price = float(price_val or 0)
                currency = item.get("currency", "€")

            results.append(
                ProductResponse(
                    id=item_id,
                    title=item.get("title", "Unknown"),
                    price=f"{price} {currency}",
                    raw_price=price,
                    link=f"https://www.vinted.it{item.get('path')}",
                    image=(
                        item.get("photos", [{}])[0].get("url")
                        if item.get("photos")
                        else None
                    ),
                    condition=item.get("status", "N/A"),
                    source=self.name,
                )
            )

        logger.info(
            "Vinted search(%r) → %d raw, %d results",
            keyword, len(raw_items), len(results),
        )
        return sorted(results, key=lambda x: x.raw_price)
