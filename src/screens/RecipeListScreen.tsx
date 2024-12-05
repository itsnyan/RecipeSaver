import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { DatabaseService } from '../utils/db';
import { Recipe } from '../types/recipe';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RecipeListScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [])
  );

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const loadedRecipes = await DatabaseService.getRecipes();
      setRecipes(loadedRecipes);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (recipe: Recipe) => {
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete "${recipe.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await DatabaseService.deleteRecipe(recipe.id);
              setRecipes(currentRecipes => 
                currentRecipes.filter(r => r.id !== recipe.id)
              );
              Alert.alert("Success", "Recipe deleted successfully");
            } catch (err) {
              console.error('Error deleting recipe:', err);
              Alert.alert("Error", "Failed to delete recipe");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (recipe: Recipe) => {
    navigation.navigate('EditRecipe', { recipe });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <TouchableOpacity 
              style={styles.recipeContent}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  recipeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  recipeContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  }
});

