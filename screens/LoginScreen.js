import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {storeToken} from '../api/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {BASE_URL} from '../api/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../api/authContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('a@gmail.com');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const {signIn} = useAuth();

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }

    if (route.params?.password) {
      setPassword(route.params.password);
    }
  }, [route.params]);

  const handleLogin = async () => {
    try {
      const userData = {
        email: email.trim(),
        password: password,
      };

      const response = await axios.post(`${BASE_URL}api/login/`, userData);

      console.log('Login response data:', JSON.stringify(response.data));

      if (response.status === 200) {
        // Use response.data.token, or response.data.access if using SimpleJWT
        const token = response.data.token || response.data.access;
        
        if (!token) {
          console.error('No token found in response. Keys:', Object.keys(response.data));
          setModalVisible(true);
          return;
        }

        await storeToken(token);

        setEmail('');
        setPassword('');

        signIn(token);
        navigation.navigate('MainTab');
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      setModalVisible(true);
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

                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>
                    Login to continue your journey with a clean and secure
                    experience.
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  style={styles.input}
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#8A8A8A"
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
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
                  onPress={handleLogin}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>
                    Don&apos;t have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupText}> Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Login Failed</Text>
              <Text style={styles.modalText}>
                Invalid email or password. Please try again.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  loginButton: {
    backgroundColor: '#F2F4F8',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginButtonText: {
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
  signupText: {
    color: '#2F5BFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 20, 64, 0.45)',
    paddingHorizontal: 24,
  },
  modalView: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  modalText: {
    textAlign: 'center',
    color: '#5F5F5F',
    fontSize: 15,
    lineHeight: 22,
  },
  modalButton: {
    marginTop: 18,
    backgroundColor: '#2F5BFF',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LoginScreen;
