// HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Account = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transactions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 30,
    color: 'white',
  },
});

export default Account;
