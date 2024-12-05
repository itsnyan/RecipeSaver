import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, LogBox } from 'react-native';
import { AuthService } from '../utils/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { app } from '../config/firebase';

type AuthMode = 'signin' | 'register';

LogBox.ignoreLogs([
  'FirebaseRecaptchaVerifierModal: Support for defaultProps will be removed from function components'
]);

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  useEffect(() => {
    AuthService.setRecaptchaVerifier(recaptchaVerifier);
  }, []);

  const handleSendCode = async () => {
    try {
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const result = await AuthService.sendVerificationCode(formattedNumber);
      setVerificationId(result);
      Alert.alert('Success', 'Verification code sent!');
    } catch (error: any) {
      console.log('Error sending code:', error);
      Alert.alert('Error', 'Please enter a valid phone number (e.g., +1234567890)');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationId) {
      Alert.alert('Error', 'Please request a verification code first');
      return;
    }

    try {
      await AuthService.verifyCode(verificationId, verificationCode);
      Alert.alert('Success', `${mode === 'signin' ? 'Signed in' : 'Registered'} successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code');
    }
  };

  const resetAuth = () => {
    setVerificationId(null);
    setVerificationCode('');
    setPhoneNumber('');
    // Use _reset instead of reset
    recaptchaVerifier.current?._reset();
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters except '+'
    let cleaned = text.replace(/[^\d+]/g, '');
    
    // Ensure starts with '+1'
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    if (!cleaned.startsWith('+1') && cleaned.length > 1) {
      cleaned = '+1' + cleaned.substring(1);
    }
    
    // Limit to proper length (+1 plus 10 digits)
    if (cleaned.length > 12) {
      cleaned = cleaned.substring(0, 12);
    }
    
    setPhoneNumber(cleaned);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, mode === 'signin' && styles.activeToggle]}
          onPress={() => setMode('signin')}
        >
          <Text style={styles.toggleText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, mode === 'register' && styles.activeToggle]}
          onPress={() => setMode('register')}
        >
          <Text style={styles.toggleText}>Register</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
      </Text>

      <TextInput
  style={styles.input}
  placeholder="Phone Number (e.g., +1234567890)"
  value={phoneNumber}
  onChangeText={formatPhoneNumber}
  keyboardType="phone-pad"
/>
      <Button title="Send Verification Code" onPress={handleSendCode} />

      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />
      <Button 
        title={mode === 'signin' ? 'Sign In' : 'Register'} 
        onPress={handleVerifyCode} 
      />

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
}); 