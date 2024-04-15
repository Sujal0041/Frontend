import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Wallets from '../screens/Wallets';
import {Dropdown} from 'react-native-element-dropdown';
import {addBudget} from '../api/api';

const AddBudget = ({modalVisible, setModalVisible, fetchBudgets}) => {
  const [amount, setAmount] = useState('');
  const [BName, setBName] = useState('');
  const [category, setCategory] = useState('Food');
  const [showWallets, setShowWallets] = useState(false);
  const [wallet, setWallet] = useState('');
  const [isFocus, setIsFocus] = useState(false); // Define isFocus state
  const [isFormValid, setIsFormValid] = useState(true);

  const handleWalletSelection = selectedWallet => {
    setWallet(selectedWallet);
    setShowWallets(false);
  };

  const handleAddBudget = async () => {
    try {
      await addBudget({
        amount: parseFloat(amount), // Convert amount to a float (assuming amount is a number)
        name: BName,
        category,
        wallet: wallet.id,
        user: 6,
      });
      setAmount('');
      setBName('');
      setCategory('Food');
      setWallet('');
      setModalVisible(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      {/* <View style={styles.container}> */}
      {showWallets ? (
        <Wallets handleWalletSelection={handleWalletSelection} />
      ) : (
        <View style={styles.modalContainer}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Transaction</Text>
          </View>

          <View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputAmount}
                placeholder="0"
                placeholderTextColor={'white'}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <View>
              <TextInput
                style={[styles.input, {color: 'white'}]}
                placeholder="Budget Name"
                placeholderTextColor="#8c8c8e"
                value={BName}
                onChangeText={setBName}
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Text style={styles.categoryText}>Category</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: '#277ad0', borderWidth: 1}, // Change border color when focused
                ]}
                placeholderStyle={{color: '#8c8c8e'}} // Change placeholder text color
                selectedTextStyle={{color: '#8c8c8e', fontWeight: 'bold'}} // Change selected option text color and font weight
                iconStyle={{color: '#333333'}} // Change icon color
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
                {
                  backgroundColor: '#333136',
                  borderRadius: 10,
                  marginTop: 10,
                },
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
                    {
                      color: '#8c8c8e',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    },
                  ]}>
                  {wallet.name || 'Select Wallet'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, {backgroundColor: '#8c8c8e'}]}
              onPress={handleAddBudget}>
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
        </View>
      )}
      {/* </View> */}
    </Modal>
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
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: '#277ad0',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  inputAmount: {
    flex: 1,
    fontSize: 20,
    color: 'white', // Default text color
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'roboto',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
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
});

export default AddBudget;
