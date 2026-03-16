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
  max_price: number | null;
  condition: string | null;
}

export interface SearchFilters {
  min_price: string;
  max_price: string;
  sources: string[];
}

export type RootStackParamList = {
  Tabs: { screen?: string; params?: { query?: string } } | undefined;
  ProductDetail: { product: Product };
};

export type TabParamList = {
  Search: { query?: string } | undefined;
  Scanner: undefined;
  Alerts: undefined;
  OCR: undefined;
};
