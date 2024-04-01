import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import {addTransaction} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const Dropdown = ({defaultValue, options, onSelect}) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleOptionPress = option => {
    setSelectedValue(option);
    setVisible(false);
    onSelect(option);
  };

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Text>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View style={styles.dropdownModal}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleOptionPress(option)}>
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const ManageTransaction = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionType, setTransactionType] = useState('Income');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleAddTransaction = async () => {
    const transactionData = {
      amount: parseFloat(amount),
      notes: notes.trim(),
      type: transactionType.toLowerCase(),
      category,
      wallet: 1,
      user: 6,
      date,
    };
    try {
      await addTransaction(transactionData);
      setAmount('');
      setNotes('');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />
      <Dropdown
        defaultValue={transactionType}
        options={['Income', 'Expense']}
        onSelect={setTransactionType}
      />
      <Dropdown
        defaultValue={category}
        options={['Food', 'Shopping', 'Entertainment', 'Transport', 'Others']}
        onSelect={setCategory}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>
          {date.toLocaleString('en-US')}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownModal: {
    marginTop: 50,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  option: {
    padding: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePickerText: {
    marginBottom: 10,
    fontSize: 16,
    color: 'blue',
  },
});

export default ManageTransaction;
