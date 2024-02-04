// HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ManageExpense = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ManageExpense</Text>
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

export default ManageExpense;
