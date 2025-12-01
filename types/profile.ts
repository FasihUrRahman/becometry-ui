export interface Profile {
  id: number;
  name: string;
  category_id: number;
  subcategory_id: number;
  image_url: string;
  insight: string;
  notes?: string;
  notes_url?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
  subcategory_name?: string;
  subcategory_slug?: string;
  tags?: Tag[];
  social_links?: SocialLink[];
}

export interface ProfileCard {
  id: number;
  name: string;
  image_url: string;
  insight: string;
  published_at?: string;
  created_at?: string;
  category_name: string;
  category_id?: number;
  subcategory_name?: string;
  subcategory_id?: number;
  location?: string;
  language?: string;
  social_links?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Tag {
  id: number;
  name: string;
  type: 'universal' | 'contextual';
}

export interface ProfileFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  subcategory_ids?: number[];
  tag_ids?: number[];
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  random?: boolean;
}
