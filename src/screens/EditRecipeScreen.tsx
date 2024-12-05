import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { DatabaseService } from '../utils/db';
import { Recipe } from '../types/recipe';

type Props = NativeStackScreenProps<RootStackParamList, 'EditRecipe'>;

export default function EditRecipeScreen({ route, navigation }: Props) {
  const { recipe } = route.params;
  const [title, setTitle] = useState(recipe.title);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [notes, setNotes] = useState(recipe.notes || '');

  const handleSave = async () => {
    if (!title || !instructions) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const updatedRecipe: Partial<Recipe> = {
        title,
        instructions,
        notes
      };

      await DatabaseService.updateRecipe(recipe.id, updatedRecipe);
      Alert.alert('Success', 'Recipe updated successfully!');
      navigation.navigate('RecipeList');
    } catch (error) {
      console.error('Failed to update recipe:', error);
      Alert.alert('Error', 'Failed to update recipe');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipe URL"
        value={instructions}
        onChangeText={setInstructions}
        autoCapitalize="none"
        keyboardType="url"
      />
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 