import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const RegisterScreen = () => {
  const [RegEmail, setRegEmail] = useState('');
  const [number, setNumber] = useState('');
  const [RegPassword, setRegPassword] = useState('');

  const handleRegister = async () => {
    console.log(`Email: ${RegEmail}, Password: ${RegPassword}`);
    try {
      const response = await axios.post("http://100.64.245.171:8000/api/register/", {
        email: RegEmail,
        password: RegPassword,
      });

      console.log("Registration successful:", response.data);
    } catch (error) {
      console.log("Registration failed:", error);
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 30 }}>Register Here</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Enter your email"
        onChangeText={(text) => setRegEmail(text)}
        value={RegEmail}
        marginBottom={10}
      />

      <TextInput
        style={styles.TextInput}
        placeholder="Enter your Phone Number"
        onChangeText={(text) => setNumber(text)}
        value={number}
        keyboardType="numeric"
        marginBottom={10}
      />

      <TextInput
        style={styles.TextInput}
        placeholder="Enter your Password"
        onChangeText={(text) => setRegPassword(text)}
        value={RegPassword}
        marginBottom={10}
      />
      <Button title="Register" onPress={handleRegister} />
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

export default RegisterScreen;
