import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import AddBudget from './AddBudget';
import {getBudgetList} from '../api/api';
import {ScrollView} from 'react-native-gesture-handler';

const Budget = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await getBudgetList();
        setBudgets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBudgets();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.budgetItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BudgetDetail', {budget: item})}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
      <AddBudget
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <ScrollView>
        <Text style={styles.text}>Budgets</Text>
        <FlatList
          data={budgets}
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
    top: 12,
    left: 12,
    zIndex: 1,
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'lightgrey',
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

export default Budget;
