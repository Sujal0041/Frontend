// EditWallet.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import {getExchangeRate, updateWallet} from '../api/api';
import {Dropdown} from 'react-native-element-dropdown';

const EditWallet = ({route}) => {
  const {wallet} = route.params;
  const [name, setName] = useState(wallet.name);
  const [type, setType] = useState(wallet.type);
  const [amount, setAmount] = useState(wallet.amount.toString());
  const [currency, setCurrency] = useState(wallet.currency);
  const navigation = useNavigation();
  const {userToken, currency: currencyOptions} = useAuth();

  const handleSave = async () => {
    try {
      console.log('Update', wallet);
      const rate = await getExchangeRate(wallet.currency, currency);
      const updatedWallet = {
        ...wallet,
        name,
        type,
        amount: parseFloat((amount * rate).toFixed(2)),
        currency,
        rate,
      };
      await updateWallet(updatedWallet.id, updatedWallet, userToken);
      Alert.alert('Success', 'Wallet updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed', error);
      Alert.alert('Error', 'Failed to update wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Type</Text>
      <Dropdown
        style={styles.input}
        data={[
          {label: 'Bank', value: 'Bank'},
          {label: 'Cash', value: 'Cash'},
        ]}
        placeholderStyle={{color: 'white'}}
        selectedTextStyle={{color: 'white'}}
        labelField="label"
        valueField="value"
        placeholder="Select wallet type"
        value={wallet.type}
        onChange={item => setType(item.value)}
      />
      <Text style={styles.label}>Currency</Text>
      <Dropdown
        style={styles.input}
        search
        searchPlaceholder="Search..."
        data={currencyOptions.map(curr => ({label: curr, value: curr}))}
        placeholderStyle={{color: 'white'}}
        selectedTextStyle={{color: 'white'}}
        labelField="label"
        valueField="value"
        placeholder="Select currency"
        dropdownPosition="top"
        value={wallet.currency}
        onChange={item => setCurrency(item.value)}
      />
      {/* <TextInput style={styles.input} value={type} onChangeText={setType} /> */}
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
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
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditWallet;
