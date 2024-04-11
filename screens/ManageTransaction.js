import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import {addTransaction} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import {useRoute} from '@react-navigation/native';
import Wallets from './Wallets';
import {useNavigation} from '@react-navigation/native';

const ManageTransaction = ({modalVisible, setModalVisible}) => {
  const route = useRoute();
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();
  const [notes, setNotes] = useState('');
  const [transactionType, setTransactionType] = useState('Income');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [wallet, setWallet] = useState('');
  const [showWallets, setShowWallets] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);
  const [isFormValid, setIsFormValid] = useState(true);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const navigateToWallets = () => {
    navigation.navigate('Wallets');
  };

  useEffect(() => {
    if (route.params && route.params.selectedWallet) {
      setWallet(route.params.selectedWallet);
    }
    if (route.params && typeof route.params.showWallets !== 'undefined') {
      setShowWallets(route.params.showWallets);
    }
  }, [route.params]);

  const handleWalletSelection = selectedWallet => {
    setWallet(selectedWallet);
    setShowWallets(false);
  };

  const handleAddTransaction = async () => {
    if (!amount || !notes || !category || !wallet) {
      setIsFormValid(false);
      return;
    }

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
      setWallet('');
      setModalVisible(false);
      setNavigationKey(prevKey => prevKey + 1);
      setIsFormValid(true);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      {showWallets ? (
        <Wallets handleWalletSelection={handleWalletSelection} />
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Transaction</Text>
          </View>

          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                transactionType === 'Income' ? styles.selectedButton : null,
              ]}
              onPress={() => setTransactionType('Income')}>
              <Text
                style={[
                  styles.transactionTypeButtonText,
                  transactionType === 'Income'
                    ? styles.selectedButtonText
                    : null,
                ]}>
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                transactionType === 'Expense' ? styles.selectedButton : null,
              ]}
              onPress={() => setTransactionType('Expense')}>
              <Text
                style={[
                  styles.transactionTypeButtonText,
                  transactionType === 'Expense'
                    ? styles.selectedButtonText
                    : null,
                ]}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.inputSign,
                transactionType === 'Income'
                  ? {color: 'green'}
                  : {color: 'red'},
              ]}>
              {transactionType === 'Income' ? '+' : '-'}
            </Text>
            <TextInput
              style={[
                styles.inputAmount,
                transactionType === 'Income' && {color: 'green'},
                transactionType === 'Expense' && {color: 'red'},
              ]}
              placeholder="0"
              placeholderTextColor={
                transactionType === 'Income' ? 'green' : 'red'
              }
              keyboardType="numeric"
              value={amount}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                const formattedValue = Number(numericValue).toLocaleString();
                setAmount(formattedValue);
              }}
            />
          </View>

          <TextInput
            style={[
              styles.input,
              {color: 'white'}, // Inline style for text color
            ]}
            placeholder="Notes"
            placeholderTextColor="#8c8c8e"
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.dropdownContainer}>
            <Text style={styles.categoryText}>Category</Text>
            <Dropdown
              style={[
                styles.dropdown,
                isFocus && {borderColor: '#277ad0', borderWidth: 1}, // Change border color when focused
              ]}
              placeholderStyle={{color: '#8c8c8e'}} // Change placeholder text color
              selectedTextStyle={{color: '#8c8c8e', fontWeight: 'bold'}} // Change selected option text color and font weight
              iconStyle={{color: '#333'}} // Change icon color
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
          </View>

          <TouchableOpacity
            style={[
              styles.walletButton,
              {backgroundColor: '#333136', borderRadius: 10, marginTop: 10},
            ]}
            onPress={() => setShowWallets(true)}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.accountText,
                  {color: 'white', fontWeight: 'bold', textAlign: 'left'},
                ]}>
                Account
              </Text>
              <Text
                style={[
                  styles.walletButtonText,
                  {color: '#8c8c8e', fontWeight: 'bold', textAlign: 'right'},
                ]}>
                {wallet.name || 'Select Wallet'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {date.toLocaleDateString('en-US')}
              </Text>
            </TouchableOpacity>
          </View>
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

          <TouchableOpacity
            style={[
              styles.addButton,
              {backgroundColor: '#8c8c8e'}, // Background color
            ]}
            onPress={handleAddTransaction}>
            <Text
              style={[
                styles.addButtonText,
                {color: 'white', fontFamily: 'roboto'}, // Text color and font family
              ]}>
              Add
            </Text>
          </TouchableOpacity>

          {!isFormValid && (
            <View style={styles.warningModal}>
              <Text style={styles.warningText}>
                Please fill all the details.
              </Text>
              <TouchableOpacity
                onPress={() => setIsFormValid(true)}
                style={styles.dismissButton}>
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -9,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    marginRight: 50,
    color: 'white',
    fontFamily: 'roboto',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
  },
  dropdown: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  inputSign: {
    fontSize: 20,
    marginRight: 5,
  },
  inputAmount: {
    flex: 1,
    fontSize: 20,
    color: 'black', // Default text color
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items evenly in the row
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  datePickerText: {
    fontSize: 16,
    color: 'white', // Color of the chosen date
  },
  walletButton: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#277ad0',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginLeft: -20,
    marginRight: -20,
  },
  transactionTypeButton: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333136',
  },
  selectedButton: {
    backgroundColor: '#fffefe',
    borderColor: 'green',
  },
  transactionTypeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fffefe', // Default text color
  },
  selectedButtonText: {
    color: 'black', // Text color when selected
  },
  warningModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  dismissButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  dismissButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ManageTransaction;
