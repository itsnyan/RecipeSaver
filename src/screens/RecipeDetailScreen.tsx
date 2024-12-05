import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen({ route }: Props) {
  const { recipeId } = route.params;

  return (
    <View>
      <Text>Recipe Detail Screen</Text>
      <Text>Recipe ID: {recipeId}</Text>
    </View>
  );
} 