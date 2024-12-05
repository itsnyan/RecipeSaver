import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Recipe } from './src/types/recipe';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from './src/utils/auth';

import HomeScreen from './src/screens/HomeScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import RecipeListScreen from './src/screens/RecipeListScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import EditRecipeScreen from './src/screens/EditRecipeScreen';
import AuthScreen from './src/screens/AuthScreen';

export type RootStackParamList = {
  Authentication: undefined;
  Home: undefined;
  AddRecipe: undefined;
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
  EditRecipe: { recipe: Recipe };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="Authentication" 
            component={AuthScreen}
            options={{ title: 'Sign In' }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Recipe Saver' }}
            />
            <Stack.Screen 
              name="AddRecipe" 
              component={AddRecipeScreen} 
              options={{ title: 'Add New Recipe' }}
            />
            <Stack.Screen 
              name="RecipeList" 
              component={RecipeListScreen} 
              options={{ title: 'My Recipes' }}
            />
            <Stack.Screen 
              name="RecipeDetail" 
              component={RecipeDetailScreen} 
              options={{ title: 'Recipe Details' }}
            />
            <Stack.Screen 
              name="EditRecipe" 
              component={EditRecipeScreen} 
              options={{ title: 'Edit Recipe' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
