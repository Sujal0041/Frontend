import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const GoalDetail = ({route}) => {
  const goal = route.params.goal;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.text}>{goal.name}</Text>
      <Text style={styles.text}>Used: {goal.amount * goal.progress} </Text>
      <Text style={styles.text}>
        Used Percentage: {Math.round(goal.progress * 100)}%
      </Text>
      <Text style={styles.text}>
        Remaining: {goal.amount - goal.amount * goal.progress}{' '}
      </Text>
      <Text style={styles.text}>
        Remaining Percentage: {Math.round((1 - goal.progress) * 100)}%
      </Text>
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
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
});

export default GoalDetail;
