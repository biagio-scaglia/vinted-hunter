export interface Product {
  id: string;
  title: string;
  price: string;
  raw_price: number;
  link: string;
  image?: string;
  condition?: string;
  source: string;
}

export interface MarketplaceInfo {
  name: string;
  display_name: string;
  color: string;
}

export interface Alert {
  id: number;
  query: string;
  keyword: string;
}

export interface SearchResult {
  query: string;
  ocrImage?: string;
  results: Product[];
}

export interface Filters {
  min_price: string;
  max_price: string;
  sources: string[];
}
