from typing import Dict, List, Optional

from backend.services.base import BaseMarketplace
from backend.services.vinted import VintedService
from backend.services.subito import SubitoService

_registry: Dict[str, BaseMarketplace] = {}


def _register(service: BaseMarketplace) -> None:
    _registry[service.name] = service


# ── Register all available marketplaces ───────────────────────────────────────
_register(VintedService())
_register(SubitoService())


def get(name: str) -> Optional[BaseMarketplace]:
    return _registry.get(name)


def all_services() -> List[BaseMarketplace]:
    return list(_registry.values())


def available() -> List[dict]:
    return [s.info for s in _registry.values()]
