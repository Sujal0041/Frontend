import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';


const AddWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [balance, setBalance] = useState('');
  const [walletType, setWalletType] = useState(null);

  const handleSave = () => {
    // Implement logic to save wallet details
    // For example, you can dispatch an action to store the data in Redux or make an API call
    console.log('Wallet Name:', walletName);
    console.log('Balance:', balance);
    console.log('Wallet Type:', walletType);
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
      <Text style={styles.label}>Balance:</Text>
      <TextInput
        style={styles.input}
        value={balance}
        onChangeText={setBalance}
        placeholder="Enter balance"
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
