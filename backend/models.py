from pydantic import BaseModel
from typing import Optional

class ProductResponse(BaseModel):
    id: str
    title: str
    price: str
    raw_price: float
    link: str
    image: Optional[str] = None
    condition: Optional[str] = None
