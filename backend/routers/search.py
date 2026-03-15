import asyncio
import logging
from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from backend.parser.logic import parse_search_query
from backend.services import registry

logger = logging.getLogger(__name__)
router = APIRouter()


class SearchRequest(BaseModel):
    query: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    sources: List[str] = ["vinted"]


@router.post("/search")
async def search(request: SearchRequest):
    params = parse_search_query(request.query)

    effective_max = request.max_price if request.max_price is not None else params["max_price"]
    effective_min = request.min_price

    # Resolve requested services, fall back to all if unknown names given
    services = [s for name in request.sources if (s := registry.get(name))]
    if not services:
        services = registry.all_services()

    tasks = [
        svc.search(
            keyword=params["keyword"],
            max_price=effective_max,
            condition=params["condition"],
            min_price=effective_min,
        )
        for svc in services
    ]

    results_per_source = await asyncio.gather(*tasks, return_exceptions=True)

    all_results = []
    for source_results in results_per_source:
        if isinstance(source_results, Exception):
            logger.warning("Source search failed: %s", source_results)
            continue
        all_results.extend(source_results)

    all_results.sort(key=lambda x: x.raw_price)

    return {
        "params": params,
        "results": [r.dict() for r in all_results],
    }


@router.get("/sources")
async def get_sources():
    """Return all available marketplace sources with display info."""
    return registry.available()
