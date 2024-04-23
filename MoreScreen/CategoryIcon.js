import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';

const CategoryIcon = () => {
  const navigation = useNavigation();

  // Define the constant for icons
  const icons = [
    'bowl-food',
    'cart-shopping',
    'bus-simple',
    'gamepad',
    'money-check-dollar',
    'house',
    'business-time',
    'hospital',
    'car',
    'computer',
    'school',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Icons</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.iconGrid}>
        {icons.map(selectedIcon => (
          <TouchableOpacity
            key={selectedIcon}
            style={styles.iconContainer}
            onPress={() => navigation.navigate('AddCategory', {selectedIcon})}>
            <FontAwesomeIcon name={selectedIcon} size={30} color="white" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 50,
  },
  iconContainer: {
    margin: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});

export default CategoryIcon;
