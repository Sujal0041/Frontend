import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ViewCategory = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddCategory')}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.text}>Hello, React Native! View Category</Text>
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
});

export default ViewCategory;
