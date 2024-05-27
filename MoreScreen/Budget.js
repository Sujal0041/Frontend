import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import * as Progress from 'react-native-progress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AddBudget from './AddBudget';
import {getBudgetList, getTotalDividedByBudgetAmount} from '../api/api';
import {useAuth} from '../api/authContext';

const Budget = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const {userToken} = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      fetchBudgets();
    }, []),
  );

  const fetchBudgets = async () => {
    try {
      const data = await getBudgetList();
      const budgetWithProgressPromises = data.map(async budget => {
        const progressData = await getTotalDividedByBudgetAmount(
          userToken,
          budget.wallet,
          budget.category,
        );
        const progress = progressData[0];
        return {...budget, progress};
      });

      const budgetsWithProgress = await Promise.all(budgetWithProgressPromises);
      setBudgets(budgetsWithProgress);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.budgetItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BudgetDetail', {budget: item})}>
        <View style={styles.topContainer}>
          <Text style={styles.budgetName}>{item.name}</Text>
          <Text style={styles.budgetAmount}>{item.amount}</Text>
          <Text style={styles.progress}>
            {(item.progress * 100).toFixed(2)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Progress.Bar progress={item.progress || 0} width={330} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.text}>Budgets</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={budgets}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 60}}
        style={{paddingTop: 70}} // Adjust this value to give space below the header
      />
      <AddBudget
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        fetchBudgets={fetchBudgets}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e1e',
    zIndex: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  budgetName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  budgetAmount: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  progress: {
    color: 'white',
    fontSize: 16,
    textAlign: 'right',
  },
  progressBar: {
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  plusButton: {
    padding: 10,
    borderRadius: 50,
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
