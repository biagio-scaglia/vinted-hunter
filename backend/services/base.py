from abc import ABC, abstractmethod
from typing import List, Optional

from backend.models import ProductResponse


class BaseMarketplace(ABC):
    name: str          # machine key  e.g. "vinted"
    display_name: str  # shown in UI  e.g. "Vinted"
    color: str         # hex for frontend badge e.g. "#8b5cf6"

    @abstractmethod
    async def search(
        self,
        keyword: str,
        max_price: Optional[float] = None,
        condition: Optional[str] = None,
        min_price: Optional[float] = None,
    ) -> List[ProductResponse]:
        ...

    @property
    def info(self) -> dict:
        return {
            "name": self.name,
            "display_name": self.display_name,
            "color": self.color,
        }
