import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { DatabaseService } from '../utils/db';

type AddRecipeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddRecipe'>;
};

export default function AddRecipeScreen({ navigation }: AddRecipeScreenProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!title || !url) {
      Alert.alert('Error', 'Please fill in title and URL');
      return;
    }

    try {
      const newRecipe = {
        title,
        instructions: url,
        notes: notes || '', 
        ingredients: [],
        createdAt: Date.now()
      };

      console.log('Attempting to save recipe:', newRecipe);
      await DatabaseService.addRecipe(newRecipe);
      console.log('Recipe saved successfully');
      Alert.alert('Success', 'Recipe saved successfully!');
      navigation.navigate('RecipeList');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      Alert.alert('Error', 'Failed to save recipe');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipe URL"
        value={url}
        onChangeText={setUrl}
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
      <Button title="Save Recipe" onPress={handleSave} />
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
