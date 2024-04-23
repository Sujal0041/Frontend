import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Reminder = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, React Native! Reminder</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Reminder;
