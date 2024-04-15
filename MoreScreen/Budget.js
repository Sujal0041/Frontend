import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import * as Progress from 'react-native-progress';
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
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgetList();
      setBudgets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.budgetItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BudgetDetail', {budget: item})}>
        <Text style={styles.budgetlist}>{item.name}</Text>
        <Progress.Bar progress={0.3} width={200} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Budgets</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <AddBudget
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        fetchBudgets={fetchBudgets}
      />
      <ScrollView>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    paddingTop: 60,
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
  budgetlist: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 10,
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
  budgetItem: {
    backgroundColor: '#333136',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Budget;
