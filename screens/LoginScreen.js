import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://100.64.245.171:8000/api/login/', {
            email: Email,
            password: Password,
        });
        console.log(`Email: ${Email}, Password: ${Password}`);

        const token = response.data.token;
        // You can store the token in AsyncStorage or Redux for future requests

        // Clear the form fields
        clear();
    } catch (error) {
        console.error('Login failed:', error);
        // Handle error, show a message, etc.
    }
};
const navigation = useNavigation();
const handleRegisterPress = () => {
  navigation.navigate('Register');
};

  return (
    <View marginBottom={10}>
      <Text style={{fontSize: 30}}>Login Form</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Enter your email"
        onChangeText={text => setEmail(text)}
        value={Email}
        marginBottom={10}
      />

      <TextInput
        placeholder="Enter Password 8 letters long"
        style={styles.TextInput}
        value={Password}
        secureTextEntry={passwordVisible}
        onChangeText={text => setPassword(text)}
      />
      <View style={{margin: 10}}>
        <Button
          title={passwordVisible ? '🙈' : '🐵'}
          color={'white'}
          onPress={
            passwordVisible
              ? () => setPasswordVisible(false)
              : () => setPasswordVisible(true)
          }
        />
      </View>

      <View style={{margin: 10}}>
        <Button title="Print Value" onPress={() => setDisplay(true)} />
      </View>
      <View style={{margin: 10}}>
        <Button title="Clear" onPress={clear} />
      </View>
      <View style={{margin: 10}}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={{margin: 10}}>
        <Button title="Register" onPress={handleRegisterPress} />
      </View>
      <View>
        {display ? (
          <View>
            <Text style={{fontSize: 20}}> User Email is :{Email} </Text>
            <Text style={{fontSize: 20}}> User Password is :{Password} </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    fontSize: 19,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
