import regex as re
from typing import Dict, Optional

def parse_search_query(query: str) -> Dict:
    query = query.lower().strip()
    
    max_price = None
    price_match = re.search(r'(?:sotto|meno di|max|fino a|a meno di)\s*(\d+(?:[.,]\d+)?)', query)
    if price_match:
        max_price = float(price_match.group(1).replace(',', '.'))
        query = query.replace(price_match.group(0), '').strip()
    
    condition = None
    if any(word in query for word in ['nuovo', 'nuova', 'brand new', 'sigillato']):
        condition = 'new'
        query = re.sub(r'\b(nuovo|nuova|brand new|sigillato)\b', '', query).strip()
    elif any(word in query for word in ['ottime condizioni', 'come nuovo', 'perfetto']):
        condition = 'excellent'
        query = re.sub(r'\b(ottime condizioni|come nuovo|perfetto)\b', '', query).strip()

    keyword = re.sub(r'\s+', ' ', query).strip()
    
    return {
        "keyword": keyword,
        "max_price": max_price,
        "condition": condition
    }
