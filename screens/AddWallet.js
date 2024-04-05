import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {addWallet} from '../api/api'; // Import addWallet function
import {useNavigation} from '@react-navigation/native';

const AddWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState(null);
  const navigation = useNavigation();

  const handleSave = async () => {
    // Create walletData object to send to addWallet function
    const walletData = {
      name: walletName,
      amount: parseFloat(amount), // Convert amount to a float (assuming amount is a number)
      type: walletType,
      user: 6,
    };

    try {
      // Call addWallet function with walletData
      const response = await addWallet(walletData);
      navigation.navigate('Wallets');

      console.log('Wallet added successfully:', response);
      // Optionally, you can navigate to another screen or perform other actions upon successful addition of wallet
    } catch (error) {
      console.error('Error adding wallet:', error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wallet Name:</Text>
      <TextInput
        style={styles.input}
        value={walletName}
        onChangeText={setWalletName}
        placeholder="Enter wallet name"
      />
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Type:</Text>
      <Dropdown
        style={styles.dropdown}
        data={[
          {label: 'Bank', value: 'Bank'},
          {label: 'Cash', value: 'Cash'},
        ]}
        labelField="label"
        valueField="value"
        placeholder="Select wallet type"
        value={walletType}
        onChange={item => setWalletType(item.value)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddWallet;
