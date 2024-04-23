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
import {useAuth} from '../api/authContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AddWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState(null);
  const navigation = useNavigation();
  const {userToken} = useAuth();

  const handleSave = async () => {
    // Create walletData object to send to addWallet function
    const walletData = {
      name: walletName,
      amount: parseFloat(amount), // Convert amount to a float (assuming amount is a number)
      type: walletType,
    };

    try {
      // Call addWallet function with walletData
      const response = await addWallet(walletData, userToken);

      navigation.goBack();

      console.log('Wallet added successfully:', response);
      // Optionally, you can navigate to another screen or perform other actions upon successful addition of wallet
    } catch (error) {
      console.error('Error adding wallet:', error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wallet</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Wallet Name</Text>
        <TextInput
          style={styles.input}
          value={walletName}
          onChangeText={setWalletName}
          placeholder="Enter wallet name"
          placeholderTextColor="white"
        />
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          placeholderTextColor="white"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Type</Text>
        <Dropdown
          style={styles.dropdown}
          data={[
            {label: 'Bank', value: 'Bank'},
            {label: 'Cash', value: 'Cash'},
          ]}
          labelField="label"
          valueField="value"
          placeholder="Select wallet type"
          placeholderTextColor="white"
          value={walletType}
          onChange={item => setWalletType(item.value)}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.addButton,
          {backgroundColor: '#8c8c8e'}, // Background color
        ]}
        onPress={handleSave}>
        <Text
          style={[
            styles.addButtonText,
            {color: 'white', fontFamily: 'roboto'}, // Text color and font family
          ]}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
    justifyContent: 'flex-start',
  },
  formContainer: {
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    color: 'white',
    placeholderTextColor: 'white',
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default AddWallet;
