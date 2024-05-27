import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {storeToken} from '../api/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {BASE_URL} from '../api/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../api/authContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation();
  const {signIn} = useAuth();

  const handleLogin = async () => {
    try {
      const userData = {
        email: email,
        password: password,
      };

      const response = await axios.post(`${BASE_URL}api/login/`, userData);

      if (response.status === 200) {
        const token = response.data.token;
        await storeToken(token);

        setEmail('');
        setPassword('');

        signIn(token);

        navigation.navigate('MainTab');
      } else {
        setModalVisible(true); // Display modal for unexpected errors
      }
    } catch (error) {
      setModalVisible(true); // Display modal for network errors or other exceptions
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#7B70F9'}}>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Image
            source={require('../images/android-chrome-512x512.png')}
            style={{
              width: 150,
              height: 150,
              marginLeft: 125,
              marginTop: 1,
            }}
          />
          <Image
            source={require('../images/logo.jpg')}
            style={{
              width: 150,
              height: 150,
              marginLeft: 125,
              marginTop: 1,
            }}
          />
        </View>
      </SafeAreaView>

      <View
        style={{
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          flex: 1,
          backgroundColor: 'white',
          padding: 8,
          paddingTop: 25,
        }}>
        <Text style={{color: '#333', marginLeft: 16}}>Email Address</Text>
        <TextInput
          onChangeText={text => setEmail(text)}
          value={email}
          style={styles.input}
        />

        <Text style={{color: '#333', marginLeft: 15}}>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 15,
          }}>
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Text>{isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Login Failed</Text>
            <Text style={styles.modalText}>
              An unexpected error occurred. Please try again later.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 10,
    padding: 13,
    backgroundColor: '#D3D3D3',
    color: '#333',
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#707070',
  },
  loginButton: {
    paddingVertical: 12,
    backgroundColor: '#FFD700',
    marginHorizontal: 14,
    borderRadius: 12,
    marginTop: 15,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#707070',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
    fontSize: 15,
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
});

export default LoginScreen;
