export interface Product {
  id: string;
  title: string;
  price: string;
  raw_price: number;
  link: string;
  image?: string;
  condition?: string;
}

export interface Alert {
  id: number;
  query: string;
  keyword: string;
}

export interface SearchResult {
  query: string;
  ocrImage?: string;  // data URL when search was triggered via OCR
  results: Product[];
}

export interface Filters {
  min_price: string;
  max_price: string;
}
