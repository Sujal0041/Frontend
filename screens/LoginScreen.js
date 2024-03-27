import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import api from '../api/api';
import {useNavigation} from '@react-navigation/native';
import {storeToken, retrieveToken} from '../api/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {BASE_URL} from '../api/api';

const LoginScreen = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  //backend
  const handleLogin = async () => {
    try {
      const userData = {
        email: Email,
        password: Password,
      };

      const response = await axios.post(`${BASE_URL}api/login/`, userData);

      console.log(`Email: ${Email}, Password: ${Password}`);
      // const response = await api.post('api/login/', {
      //   email: Email,
      //   password: Password,
      // });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        const token = response.data.token;
        await storeToken(token);
        setEmail('');
        setPassword('');
        navigation.navigate('MainTab');
      } else {
        // Handle unexpected server responses
        // console.error('Unexpected server response:', response);
        // Display an error message to the user
        Alert.alert(
          'Login Failed',
          'An unexpected error occurred. Please try again later.',
        );
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Login failed:', error);
      // Display an error message to the user
      Alert.alert('Login Failed', 'Please Enter Correct Email and Password');
    }
  };

  //Backend End

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
          style={{
            margin: 10,
            padding: 13,
            backgroundColor: '#D3D3D3',
            color: '#333',
            borderRadius: 20,
            marginBottom: 10,
          }}
        />

        <Text style={{color: '#333', marginLeft: 15}}>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
          secureTextEntry={!isPasswordVisible}
          style={{
            margin: 10,
            padding: 13,
            backgroundColor: '#D3D3D3',
            color: '#333',
            borderRadius: 20,
            marginBottom: 10,
          }}
        />
        {/* <TouchableOpacity>
          <AntDesign name="eye" size={24} color="black" />
        </TouchableOpacity> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 15,
          }}>
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              {isPasswordVisible ? 'Hide Password' : 'Show Password'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            paddingVertical: 12,
            backgroundColor: '#FFD700',
            marginHorizontal: 14,
            borderRadius: 12,
            marginTop: 15,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#707070',
            }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    fontSize: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
