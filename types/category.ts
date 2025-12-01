export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  created_at: string;
}
