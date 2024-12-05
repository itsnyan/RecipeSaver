export interface Recipe {
  id: string;
  title: string;
  instructions: string;
  notes?: string;
  ingredients: string[];
  createdAt: number;
}
