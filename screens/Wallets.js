import React, {useState, useEffect} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {getAllWallets} from '../api/api';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Wallets = () => {
  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    // Fetch wallets when component mounts
    fetchWallets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchWallets();
    }, []),
  );

  const fetchWallets = async () => {
    try {
      const walletsData = await getAllWallets();
      setWallets(walletsData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Handle error, e.g., show error message to user
    }
  };

  const handleWalletPress = wallet => {
    navigation.navigate('ManageTransaction', {selectedWallet: wallet});
    // Do something when a wallet is pressed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallets</Text>
      {wallets.map(wallet => (
        <TouchableOpacity
          key={wallet.id}
          style={styles.walletItem}
          onPress={() => handleWalletPress(wallet)}>
          <Text>{wallet.name}</Text>
        </TouchableOpacity>
      ))}
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
  walletItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default Wallets;
