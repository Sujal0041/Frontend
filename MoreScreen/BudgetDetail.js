import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

const BudgetDetail = ({route}) => {
  const budget = route.params.budget;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{budget.name}</Text>
      <Text style={styles.text}>{budget.amount} </Text>
      <Text style={styles.text}>{budget.frequency}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BudgetDetail;
