import { Profile, ProfileCard } from './profile';
import { Category } from './category';
import { Tag } from './tag';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProfilesResponse {
  success: boolean;
  data: ProfileCard[];
  pagination: PaginationMeta;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
