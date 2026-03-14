import httpx
from typing import List, Dict, Optional
from backend.models import ProductResponse

class VintedService:
    def __init__(self):
        self.base_url = "https://www.vinted.it"
        self.api_url = "https://www.vinted.it/api/v2/catalog/items"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        self.cookies = None

    async def _fetch_cookies(self):
        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True, timeout=10.0) as client:
            try:
                response = await client.get(self.base_url)
                self.cookies = response.cookies
            except Exception as e:
                pass

    async def search(self, keyword: str, max_price: Optional[float] = None, condition: Optional[str] = None) -> List[ProductResponse]:
        if not self.cookies:
            await self._fetch_cookies()

        params = {
            "search_text": keyword,
            "order": "price_low_to_high",
            "page": 1,
            "per_page": 30
        }

        async with httpx.AsyncClient(headers=self.headers, cookies=self.cookies, timeout=15.0) as client:
            try:
                response = await client.get(self.api_url, params=params)
                
                if response.status_code == 401:
                    await self._fetch_cookies()
                    response = await client.get(self.api_url, params=params)
                
                response.raise_for_status()
                data = response.json()
                items = data.get('items', [])
                
                results = []
                for item in items:
                    price_val = item.get('price')
                    
                    if isinstance(price_val, dict):
                        price = float(price_val.get('amount') or price_val.get('numeric') or 0)
                        currency = price_val.get('currency_code', '€')
                    else:
                        price = float(price_val or 0)
                        currency = item.get('currency', '€')

                    if max_price and price > max_price:
                        continue
                        
                    results.append(ProductResponse(
                        id=str(item.get('id')),
                        title=item.get('title', 'Unknown'),
                        price=f"{price} {currency}",
                        raw_price=price,
                        link=f"https://www.vinted.it{item.get('path')}",
                        image=item.get('photos', [{}])[0].get('url') if item.get('photos') else None,
                        condition=item.get('status', 'N/A')
                    ))
                
                return sorted(results, key=lambda x: x.raw_price)
            except Exception as e:
                return []

vinted_service = VintedService()
