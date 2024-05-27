import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuth} from '../api/authContext';
import {updatePassword} from '../api/api'; // Ensure the correct path to your api.js file
import {BASE_URL} from '../api/api';

const AccountSettings = () => {
  const navigation = useNavigation();
  const {userToken} = useAuth();
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/get_user_data/`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const {name, phone} = response.data.user_data;
        setUsername(name);
        setPhoneNumber(phone);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userToken]);

  const handleSaveChanges = async () => {
    try {
      await updatePassword(userToken, {
        oldPassword: oldPassword, // You need to get the old password from the user
        newPassword: password,
      });
      console.log('Password updated successfully');
      Alert.alert(
        'Password Update',
        'Password updated successfully',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
      // You can also handle other form fields like username and phone number here
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Account Settings</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.heading}>Username</Text>
            <TextInput
              style={[styles.input, {color: '#ffffff'}]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Enter your username"
              placeholderTextColor="#aaaaaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.heading}>Phone Number</Text>
            <TextInput
              style={[styles.input, {color: '#ffffff'}]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor="#aaaaaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.heading}>Old Password</Text>
            <TextInput
              style={[styles.input, {color: '#ffffff'}]}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#aaaaaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.heading}>New Password</Text>
            <TextInput
              style={[styles.input, {color: '#ffffff'}]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Confirm your password"
              placeholderTextColor="#aaaaaa"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1e1f',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    position: 'relative',
    bottom: 25,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    position: 'relative',
    bottom: 75,
  },
  heading: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#3c8dbc',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#ffffff',
    borderRadius: 5,
    backgroundColor: '#2c2c2e',
  },
  saveButton: {
    backgroundColor: '#3c8dbc',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
  },
  formContainer: {
    position: 'relative',
    bottom: 55,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountSettings;
