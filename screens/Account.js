// HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import logout from '../api/api';

const Account = () => {
  const navigation = useNavigation();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account</Text>
      <TouchableOpacity
        onPress={handleLogout} // Call handleLogout instead of directly calling logout
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
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});

export default Account;
