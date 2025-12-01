export interface Tag {
  id: number;
  name: string;
  type: 'universal' | 'contextual';
  approved: boolean;
  created_at: string;
}

export interface TagSuggestion {
  id: number;
  name: string;
  category_coverage: number;
  profile_coverage: number;
}
