import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {getAllCategories} from '../api/api';

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderItem = ({item}) => (
    <View
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryDetail', {category: item})}>
      <View style={styles.iconCircle}>
        <FontAwesomeIcon name={item.category_icon} size={22} color="white" />
      </View>
      <Text style={styles.categoryText}>{item.category_name}</Text>
    </View>
  );

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      </View>
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  plusButton: {
    padding: 10,
  },
  categoryItem: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    width: 270,
  },
  scrollView: {
    flex: 1,
  },
});

export default ViewCategory;
