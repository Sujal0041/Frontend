import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import {
  getAllCategories,
  getAllWallets,
  updateTransaction,
  deleteTransactions,
} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';

const EditTransaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {transaction} = route.params || {}; // Safety check for route.params
  const {userToken} = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [walletName, setWalletName] = useState('');
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const typeOptions = [
    {label: 'Income', value: 'income'},
    {label: 'Expense', value: 'expense'},
  ];

  console.log(transaction);
  console.log(transaction.wallet);
  console.log(transaction.category);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setCategories(fetchedCategories);

        setCategoryName(transaction.category.category_name);
        setWalletName(transaction.wallet.name);
      } catch (error) {
        console.error('Error fetching categories or wallets:', error);
      }
    };

    fetchData();
  }, [transaction, userToken]);

  const handleUpdateTransaction = async () => {
    try {
      await updateTransaction(
        editedTransaction.id,
        editedTransaction,
        userToken,
      );
      setIsEditing(false);
      navigation.navigate('Transactions');
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransactions(editedTransaction.id, userToken);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || editedTransaction.date;
    setShowDatePicker(Platform.OS === 'ios');
    setEditedTransaction({...editedTransaction, date: currentDate});
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || editedTransaction.date;
    setShowTimePicker(Platform.OS === 'ios');
    setEditedTransaction({...editedTransaction, date: currentTime});
  };

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Transaction data not found.</Text>
      </View>
    );
  }

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(transaction.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.text}>Edit Transaction</Text>
      <View style={styles.transactionDetails}>
        {isEditing ? (
          <>
            <Dropdown
              style={styles.input}
              data={typeOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Type"
              value={editedTransaction.type}
              onChange={item =>
                setEditedTransaction({...editedTransaction, type: item.value})
              }
              placeholderStyle={{color: 'white'}}
              selectedTextStyle={{color: 'white'}}
            />
            <TextInput
              style={styles.input}
              value={editedTransaction.notes}
              onChangeText={text =>
                setEditedTransaction({...editedTransaction, notes: text})
              }
              placeholder="Notes"
            />
            <TextInput
              style={styles.input}
              value={editedTransaction.amount.toString()}
              onChangeText={text =>
                setEditedTransaction({
                  ...editedTransaction,
                  amount: parseFloat(text),
                })
              }
              placeholder="Amount"
              keyboardType="numeric"
            />
            <Dropdown
              style={styles.input}
              data={categories}
              labelField="category_name"
              valueField="id"
              placeholder="Select Category"
              value={editedTransaction.category}
              onChange={item =>
                setEditedTransaction({...editedTransaction, category: item.id})
              }
              placeholderStyle={{color: 'white'}}
              selectedTextStyle={{color: 'white'}}
            />
            <Dropdown
              style={styles.input}
              data={wallets}
              labelField="name"
              valueField="id"
              placeholder="Select Wallet"
              value={editedTransaction.wallet}
              onChange={item =>
                setEditedTransaction({...editedTransaction, wallet: item.id})
              }
              placeholderStyle={{color: 'white'}}
              selectedTextStyle={{color: 'white'}}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {new Date(editedTransaction.date).toLocaleDateString('en-US')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(editedTransaction.date)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.datePickerText}>
                {new Date(editedTransaction.date).toLocaleTimeString('en-US')}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date(editedTransaction.date)}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateTransaction}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Type: </Text>
              {transaction.type}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Note: </Text>
              {transaction.notes}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Amount: </Text>
              {transaction.amount}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Date: </Text>
              {formattedDate}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Time: </Text>
              {formattedTime}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Category: </Text>
              {categoryName}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Wallet: </Text>
              {walletName}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTransaction()}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    color: '#ffffff', // Set back button color to white
  },
  transactionDetails: {
    width: '100%',
    padding: 20,
    backgroundColor: '#333136',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#333136',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
    color: '#ffffff',
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  datePickerText: {
    color: '#ffffff',
  },
  updateButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  dropdown: {
    backgroundColor: '#333136',
  },
  dropdownText: {
    color: '#ffffff',
  },
});

export default EditTransaction;
