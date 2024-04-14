import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {logout} from '../api/api';

const More = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => handleLogout()}>
        <Text style={styles.profileButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={[styles.row, {marginTop: 50}]}>
        <TouchableOpacity
          style={[styles.button, styles.button3]}
          onPress={() => navigation.navigate('AccountSettings')}>
          <AntDesign name="user" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.button2]}
          onPress={() => navigation.navigate('Currency')}>
          <Text style={styles.text}>Currency</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.row, {marginTop: 20}]}>
        <TouchableOpacity
          style={[styles.button, styles.button3, {width: '50%'}]}>
          <AntDesign
            name="notification"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.text}>Reminder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.button3]}>
          <AntDesign name="wallet" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.text}>Wallets</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.row, {marginTop: 20}]}>
        <TouchableOpacity
          style={[styles.button, styles.button1]}
          onPress={() => navigation.navigate('Budget')}>
          <AntDesign name="bank" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.text}>Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.button3]}>
          <AntDesign name="logout" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.text}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 12,
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    color: '#fff',
  },
  profileButtonText: {
    fontSize: 16,
    color: '#277ad0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 100,
    marginRight: 10,
    flexDirection: 'row', // Added flexDirection to align icon and text horizontally
  },
  button1: {
    backgroundColor: '#333136',
  },
  button2: {
    backgroundColor: '#333136',
  },
  button3: {
    backgroundColor: '#333136',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5, // Added marginLeft to create space between icon and text
  },
  icon: {
    marginLeft: 5, // Added marginLeft to align icon and text
  },
});

export default More;
