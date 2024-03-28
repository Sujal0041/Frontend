import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Goals = () => {
  const navigation = useNavigation();

  const navigateToAnotherPage = () => {
    navigation.navigate('AddGoals');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={navigateToAnotherPage}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Goals</Text>
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
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 50,
    width: 60,
    alignItems: 'center',
  },
  plusButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Goals;
