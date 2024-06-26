import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

const ViewReminder = () => {
  const navigation = useNavigation();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    requestUserPermission();
    const fcmToken = await messaging().getToken();
    console.log('fcmToken', fcmToken);
  };

  useEffect(() => {
    getToken();
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddReminder')}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.text}>View Reminder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 1,
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    // backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 50,
    width: 60,
    alignItems: 'center',
  },
  plusButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ViewReminder;
