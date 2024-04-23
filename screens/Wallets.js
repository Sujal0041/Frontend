import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {getAllWallets} from '../api/api';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../api/authContext';

const Wallets = ({handleWalletSelection, setShowWallets}) => {
  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);

  const {userToken} = useAuth();

  useEffect(() => {
    fetchWallets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchWallets();
    }, []),
  );

  const fetchWallets = async () => {
    try {
      const walletsData = await getAllWallets(userToken);
      setWallets(walletsData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Handle error, e.g., show error message to user
    }
  };

  const handleWalletPress = wallet => {
    handleWalletSelection(wallet);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setShowWallets(false)}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddWallet')}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Wallets</Text>
      </View>
      {wallets.map(wallet => (
        <TouchableOpacity
          key={wallet.id}
          style={styles.walletItem}
          onPress={() => handleWalletPress(wallet)}>
          <Text style={styles.walletItemText}>{wallet.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    zIndex: 1,
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 50,
    width: 60,
  },
  walletItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  walletItemText: {
    fontSize: 18,
    color: 'white',
  },
});

export default Wallets;
