import React, {useState} from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import api from '../api/api';
import {RotateInDownLeft} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen = () => {
  const [RegEmail, setRegEmail] = useState('');
  const [number, setNumber] = useState('');
  const [RegPassword, setRegPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //Backend
  const handleRegister = async () => {
    console.log(
      `Email: ${RegEmail}, Password: ${RegPassword}, Phone Number: ${number}`,
    );
    try {
      const response = await api.post('api/register/', {
        email: RegEmail,
        password: RegPassword,
      });

      console.log('Registration successful:', response.data);
    } catch (error) {
      console.log('Registration failed:', error);
      console.error('Registration failed:', error.message);
    }
  };
  //backend end

  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('Register');
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
              height: 70,
              marginLeft: 125,
              marginTop: 1,
              flexDirection: 'row',
            }}
          />
          <Image
            source={require('../images/logo.jpg')}
            style={{
              width: 150,
              height: 100,
              marginLeft: 125,
              marginTop: 1,
              flexDirection: 'row',
            }}
          />
        </View>
      </SafeAreaView>
      <View
        marginTop={-180}
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
          keyboardType="email-address"
          autoCapitalize="none" // Prevents automatic capitalization
          autoCompleteType="email" // Helps autofill recognize it as an email field
          style={{
            margin: 10,
            padding: 13,
            backgroundColor: '#D3D3D3',
            color: '#333',
            borderRadius: 20,
            marginBottom: 10,
          }}
        />
        <Text style={{color: '#333', marginLeft: 16}}>Phone Number</Text>
        <TextInput
          keyboardType="numeric"
          maxLength={10}
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
          onPress={() => navigation.navigate('Login')}
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
            Register
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

export default RegisterScreen;
