import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, DatePickerAndroid, Platform } from 'react-native';

const Goals = ({ onAddGoal }) => {
  const [enteredGoal, setEnteredGoal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goalInputHandler = (text) => {
    setEnteredGoal(text);
  };

  const addGoalHandler = async () => {
    if (Platform.OS === 'android') {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: selectedDate,
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const newDate = new Date(year, month, day);
          setSelectedDate(newDate);
        }
      } catch ({ message }) {
        console.error('Cannot open date picker', message);
      }
    }
    onAddGoal(enteredGoal, selectedDate);
    setEnteredGoal('');
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Goal Name</Text>
      <TextInput
        style={styles.input}
        value={enteredGoal}
        onChangeText={goalInputHandler}
      />
      <Text style={styles.label}>Target Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Remind Me Every</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} />
        <Text style={styles.halfLabel}>Weeks</Text>
      </View>
      <Text style={styles.label}>Set Goal</Text>
      <Button title="Set Goal" onPress={addGoalHandler} />
      <Button title="Select Reminder Date" onPress={addGoalHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    margin: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  halfInput: {
    width: '50%',
  },
  halfLabel: {
    width: '50%',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Goals;