import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AuthService } from '../utils/auth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Add New Recipe"
        onPress={() => navigation.navigate('AddRecipe')}
      />
      <Button
        title="View My Recipes"
        onPress={() => navigation.navigate('RecipeList')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 10,
  },
}); 