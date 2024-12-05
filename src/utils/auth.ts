import { PhoneAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../config/firebase';
import { onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';

let recaptchaVerifierRef: React.RefObject<FirebaseRecaptchaVerifierModal> | null = null;

export const AuthService = {
  setRecaptchaVerifier(verifier: React.RefObject<FirebaseRecaptchaVerifierModal>) {
    recaptchaVerifierRef = verifier;
  },

  getRecaptchaVerifier() {
    return recaptchaVerifierRef;
  },

  async sendVerificationCode(phoneNumber: string): Promise<string> {
    try {
      const verifier = this.getRecaptchaVerifier();
      if (!verifier?.current) {
        throw new Error('reCAPTCHA Verifier is not initialized');
      }

      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        verifier.current
      );
      console.log('Verification ID received:', verificationId);
      return verificationId;
    } catch (error: any) {
      console.error('Error details:', error);
      if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Please try again and complete the reCAPTCHA');
      }
      throw error;
    }
  },

  onAuthStateChanged(callback: (user: any) => void) {
    return firebaseOnAuthStateChanged(auth, callback);
  },

  async verifyCode(verificationId: string, code: string) {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    return signInWithCredential(auth, credential);
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // ... rest of your auth service methods
}; 