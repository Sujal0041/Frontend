import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import api from '../api/api';
import {useNavigation} from '@react-navigation/native';
import {storeToken, retrieveToken} from '../api/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LoginScreen = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [display, setDisplay] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const clear = () => {
    setEmail('');
    setPassword('');
    setDisplay(false);
  };

  //backend
  const handleLogin = async () => {
    try {
      const response = await api.post('api/login/', {
        email: Email,
        password: Password,
      });

      const token = response.data.token;
      await storeToken(token);

      console.log('Login successful:', response.data);
      setEmail('');
      setPassword('');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };
  //Backend End

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
          paddingTop: 8,
        }}>
        <Text style={{color: '#333', marginLeft: 16}}>Email Address</Text>
        <TextInput
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
          style={{
            margin: 10,
            padding: 13,
            backgroundColor: '#D3D3D3',
            color: '#333',
            borderRadius: 20,
            marginBottom: 10,
          }}
        />
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
