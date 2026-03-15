import logging
import re
from typing import List, Optional

import httpx

from backend.models import ProductResponse
from backend.services.base import BaseMarketplace

logger = logging.getLogger(__name__)

_PRICE_RE = re.compile(r"[\d.,]+")


def _parse_price(features: list) -> float:
    """Extract numeric price from Subito features list."""
    for feat in features:
        if feat.get("uri") == "/price":
            values = feat.get("values", [])
            if values:
                raw = values[0].get("value") or values[0].get("key", "0")
                # value is in cents (e.g. "10000" = 100 €)
                try:
                    cents = float(raw)
                    if cents > 1000:
                        return cents / 100
                    return cents
                except ValueError:
                    # fallback: parse key string like "100 €"
                    m = _PRICE_RE.search(str(values[0].get("key", "0")))
                    return float(m.group().replace(",", ".")) if m else 0.0
    return 0.0


class SubitoService(BaseMarketplace):
    name = "subito"
    display_name = "Subito.it"
    color = "#f97316"

    _API = "https://hades.subito.it/v1/search/items"
    _HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json",
        "Accept-Language": "it-IT,it;q=0.9",
    }

    async def search(
        self,
        keyword: str,
        max_price: Optional[float] = None,
        condition: Optional[str] = None,
        min_price: Optional[float] = None,
    ) -> List[ProductResponse]:
        params: dict = {
            "q": keyword,
            "lim": 40,
            "start": 0,
            "shp": "false",
            "sort": "datedesc",
        }
        if min_price is not None:
            params["ps"] = int(min_price)
        if max_price is not None:
            params["pe"] = int(max_price)

        try:
            async with httpx.AsyncClient(
                headers=self._HEADERS, follow_redirects=True, timeout=12.0
            ) as client:
                resp = await client.get(self._API, params=params)
                resp.raise_for_status()
                data = resp.json()
        except httpx.HTTPStatusError as exc:
            logger.warning("Subito HTTP error %s", exc.response.status_code)
            return []
        except Exception:
            logger.exception("Unexpected error in SubitoService.search")
            return []

        items = data.get("items", []) or []
        results: List[ProductResponse] = []

        for item in items:
            price = _parse_price(item.get("features", []))
            if max_price and price > max_price:
                continue
            if min_price and price and price < min_price:
                continue

            images = item.get("images") or []
            image_url: Optional[str] = None
            if images:
                scales = images[0].get("scale") or []
                for s in scales:
                    if s.get("size") in ("big", "medium"):
                        image_url = s.get("secureuri") or s.get("uri")
                        break
                if not image_url:
                    image_url = images[0].get("base")

            item_url = (item.get("urls") or {}).get("default", "")

            results.append(
                ProductResponse(
                    id=str(item.get("urn", item.get("id", ""))),
                    title=item.get("subject", "Unknown"),
                    price=f"{price:.2f} €" if price else "N/D",
                    raw_price=price,
                    link=item_url,
                    image=image_url,
                    condition=None,
                    source=self.name,
                )
            )

        logger.info("Subito search(%r) → %d results", keyword, len(results))
        return sorted(results, key=lambda x: x.raw_price)
