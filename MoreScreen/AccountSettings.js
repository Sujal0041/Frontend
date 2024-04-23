import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const AccountSettings = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Logic to save changes goes here
    console.log('Changes saved');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Username</Text>
        <TextInput
          style={[styles.input, {color: '#ffffff'}]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Phone Number</Text>
        <TextInput
          style={[styles.input, {color: '#ffffff'}]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#ffffff"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Password</Text>
        <TextInput
          style={[styles.input, {color: '#ffffff'}]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#ffffff"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Confirm Password</Text>
        <TextInput
          style={[styles.input, {color: '#ffffff'}]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#ffffff"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1e1f',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  heading: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 5,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderBottomWidth: 1, // Single line at bottom
    borderColor: '#ffffff', // Color of the line
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Roboto',
  },
  saveButton: {
    backgroundColor: '#3c8dbc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountSettings;
