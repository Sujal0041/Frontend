import React, {useState, useEffect} from 'react';
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
import {Dropdown} from 'react-native-element-dropdown';
import {useRoute} from '@react-navigation/native';

const ManageTransaction = ({navigation}) => {
  const route = useRoute();
  const [amount, setAmount] = useState('');
  // const [value, setValue] = useState(null);

  const [notes, setNotes] = useState('');
  const [transactionType, setTransactionType] = useState('Income');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [wallet, setWallet] = useState('');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const navigateToWallets = () => {
    navigation.navigate('Wallets'); // Navigating to the Wallets screen
  };

  useEffect(() => {
    // Check if selectedWallet parameter exists in the route and set it to the wallet state
    if (route.params && route.params.selectedWallet) {
      setWallet(route.params.selectedWallet);
    }
  }, [route.params]);

  const handleAddTransaction = async () => {
    const transactionData = {
      amount: parseFloat(amount),
      notes: notes.trim(),
      type: transactionType.toLowerCase(),
      category,
      wallet: wallet.id,
      user: 6,
      date,
    };
    try {
      console.log(transactionData);
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
      <TouchableOpacity
        style={styles.walletButton}
        onPress={() => navigation.navigate('Wallets')}>
        <Text style={styles.walletButtonText}>
          {wallet.name || 'Select Wallet'}
        </Text>
      </TouchableOpacity>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'white'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          {label: 'Income', value: 'Income'},
          {label: 'Expense', value: 'Expense'},
        ]}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Transaction Type' : '...'}
        value={transactionType}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setTransactionType(item.value);
          setIsFocus(false);
        }}
      />
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'white'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={[
          {label: 'Food', value: 'Food'},
          {label: 'Shopping', value: 'Shopping'},
          {label: 'Entertainment', value: 'Entertainment'},
          {label: 'Transport', value: 'Transport'},
          {label: 'Others', value: 'Others'},
        ]}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Category' : '...'}
        value={category}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setCategory(item.value);
          setIsFocus(false);
        }}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>
          {date.toLocaleDateString('en-US')}
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
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 7,
    paddingHorizontal: 8,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  walletButton: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center', // Align text vertically center
  },
});

export default ManageTransaction;
