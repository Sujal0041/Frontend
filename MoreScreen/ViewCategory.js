import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {getAllCategories} from '../api/api';
import {useAuth} from '../api/authContext';

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const {userToken} = useAuth();
  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(userToken);
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, []),
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryDetail', {category: item})}>
      <View style={styles.iconCircle}>
        <FontAwesomeIcon name={item.category_icon} size={22} color="white" />
      </View>
      <Text style={styles.categoryText}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
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
        )}
        contentContainerStyle={{paddingBottom: 60}}
      />
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
    backgroundColor: '#333',
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
    backgroundColor: '#277ad0',
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
});

export default ViewCategory;
