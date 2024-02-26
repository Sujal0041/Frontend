// HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Account = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
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
