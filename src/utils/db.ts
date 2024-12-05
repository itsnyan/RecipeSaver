import { collection, addDoc, getDocs, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Recipe } from '../types/recipe';

export const DatabaseService = {
  async addRecipe(recipe: Omit<Recipe, 'id'>): Promise<void> {
    try {
      console.log('DatabaseService: Adding recipe:', recipe);
      const docRef = await addDoc(collection(db, 'recipes'), {
        ...recipe,
        createdAt: Date.now()
      });
      console.log('DatabaseService: Recipe added with ID:', docRef.id);
    } catch (e) {
      console.error('DatabaseService: Error adding recipe:', e);
      throw e;
    }
  },

  async getRecipes(): Promise<Recipe[]> {
    try {
      const q = query(collection(db, 'recipes'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Recipe));
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw e;
    }
  },

  async deleteRecipe(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      console.log("Recipe deleted:", id);
    } catch (e) {
      console.error("Error deleting recipe:", e);
      throw new Error('Failed to delete recipe');
    }
  },

  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<void> {
    try {
      await updateDoc(doc(db, 'recipes', id), recipe);
      console.log("Recipe updated:", id);
    } catch (e) {
      console.error("Error updating recipe:", e);
      throw new Error('Failed to update recipe');
    }
  }
}; 