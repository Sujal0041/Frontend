// HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Category = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category</Text>
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

export default Category;
