import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../api/api';
import AntDesign from 'react-native-vector-icons/AntDesign';

const RegisterScreen = () => {
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [number, setNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validateInputs = () => {
    const trimmedName = regUsername.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();
    const trimmedPhone = number.trim();
    const trimmedPassword = regPassword;

    if (!trimmedName) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return false;
    }

    if (trimmedName.length < 3) {
      Alert.alert('Invalid Name', 'Name must contain at least 3 characters.');
      return false;
    }

    if (!trimmedPhone) {
      Alert.alert('Missing Phone Number', 'Please enter your phone number.');
      return false;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Phone number must be exactly 10 digits.',
      );
      return false;
    }

    if (!trimmedEmail) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    if (!trimmedPassword) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return false;
    }

    if (trimmedPassword.length < 8) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least 8 characters.',
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const userData = {
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        name: regUsername.trim(),
        phone: number.trim(),
      };

      const response = await axios.post(`${BASE_URL}api/register/`, userData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Registration successful.', [
          {
            text: 'Continue',
            onPress: () =>
              navigation.navigate('Login', {
                email: regEmail.trim().toLowerCase(),
                password: regPassword,
              }),
          },
        ]);
      } else {
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'Something went wrong. Please try again.',
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2F5BFF" />

      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.topSection}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.headerContent}>
                  <View style={styles.topDotsRow}></View>

                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>
                    Register to get started with a clean and secure experience.
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  value={regUsername}
                  onChangeText={setRegUsername}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8A8A8A"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  blurOnSubmit={false}
                  style={styles.input}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  ref={phoneRef}
                  value={number}
                  onChangeText={text => setNumber(text.replace(/[^0-9]/g, ''))}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="number-pad"
                  maxLength={10}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                  style={styles.input}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  ref={emailRef}
                  value={regEmail}
                  onChangeText={setRegEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                  style={styles.input}
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={passwordRef}
                    value={regPassword}
                    onChangeText={setRegPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#8A8A8A"
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <AntDesign
                      name={isPasswordVisible ? 'eye' : 'eyeo'}
                      size={22}
                      color="#2F5BFF"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleRegister}
                  style={styles.registerButton}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}> Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#2F5BFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  topDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  activeDot: {
    width: 26,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  inactiveDot: {
    width: 4,
    height: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginRight: 6,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 34,
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    color: '#2E2E2E',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F3F5FB',
    color: '#1F1F1F',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E7ECF7',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F5FB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7ECF7',
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#1F1F1F',
  },
  registerButton: {
    backgroundColor: '#F2F4F8',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F5BFF',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },
  loginText: {
    color: '#2F5BFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RegisterScreen;
