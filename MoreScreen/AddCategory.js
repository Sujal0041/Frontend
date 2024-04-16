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

const AddCategory = () => {
  const navigation = useNavigation();
  const [categoryName, setCategoryName] = useState('');

  const handleSaveCategory = () => {
    // Handle saving the category name
    console.log('Category Name:', categoryName);
    // Reset the text input
    setCategoryName('');
  };

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
      <Text style={styles.label}>Category</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          placeholderTextColor="#8c8c8e"
          onChangeText={text => setCategoryName(text)}
          value={categoryName}
        />
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
    textAlign: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
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
});

export default AddCategory;
