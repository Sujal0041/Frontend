import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';

const AddCategory = () => {
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState('');
  // const [categoryIcons, setCategoryIcons] = useState('shoppingcart');

  const handleSaveCategory = () => {
    // Handle saving the category name
    console.log('Category Name:', categoryName);
    // Reset the text input
    setCategoryName('');
  };

  const route = useRoute();

  const {selectedIcon = null} = route.params || {};
  console.log(selectedIcon);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.plusButton} onPress={handleSaveCategory}>
        <AntDesign name="check" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.Img}
          onPress={() => navigation.navigate('CategoryIcon')}>
          <AntDesign
            name="pluscircle"
            size={24}
            color="white"
            style={{position: 'absolute', top: 90, left: 90}}
          />
          {selectedIcon ? (
            <>
              <FontAwesomeIcon name={selectedIcon} size={68} color="white" />
            </>
          ) : (
            <>
              <AntDesign name="shoppingcart" size={68} color="white" />
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          placeholderTextColor="#8c8c8e"
          onChangeText={text => setCategoryName(text)}
          value={categoryName}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          {backgroundColor: '#8c8c8e'}, // Background color
        ]}>
        <Text
          style={[
            styles.addButtonText,
            {color: 'white', fontFamily: 'roboto'}, // Text color and font family
          ]}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  Img: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    marginTop: 20,
    backgroundColor: '#333136',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
    right: 165,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 1,
  },
  plusButton: {
    position: 'absolute',
    top: 20,
    right: 12,
    zIndex: 1,
  },
  inputContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    width: '92%',
    height: 40,
    backgroundColor: '#333136',
    color: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    left: 17,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddCategory;
