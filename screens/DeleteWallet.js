import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../api/authContext';
import {deleteWallet} from '../api/api';

const DeleteWallet = ({route}) => {
  const {wallet} = route.params;
  const navigation = useNavigation();
  const {userToken} = useAuth();

  const handleDeleteWallet = async () => {
    try {
      await deleteWallet(wallet.id, userToken);
      Alert.alert('Success', 'Wallet deleted successfully');
      navigation.goBack(); // Navigate back after deletion
    } catch (error) {
      Alert.alert('Error', 'Failed to delete wallet');
    }
  };

  const handleEditWallet = () => {
    navigation.navigate('EditWallet', {wallet});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{wallet.name}</Text>
      <Text style={styles.text}>Type: {wallet.type}</Text>
      <Text style={styles.text}>Amount: {wallet.amount}</Text>
      <Text style={styles.text}>Currency: {wallet.currency}</Text>
      <TouchableOpacity style={styles.editButton} onPress={handleEditWallet}>
        <Text style={styles.editButtonText}>Update Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteWallet}>
        <Text style={styles.deleteButtonText}>Delete Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 1,
  },
});

export default DeleteWallet;
