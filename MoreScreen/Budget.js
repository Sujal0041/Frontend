import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import * as Progress from 'react-native-progress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AddBudget from './AddBudget';
import {
  getBudgetList,
  getTotalDividedByBudgetAmount,
  retrieveToken,
} from '../api/api';
import {ScrollView} from 'react-native-gesture-handler';
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
      console.log('INSIDE FETCHBUDGETS');
      const data = await getBudgetList();
      console.log('DATA FROM BACKEND', data);

      for (const budget of data) {
        console.log('SETTED BUDGET INDIVIDUAL', data);
        getProgress(budget);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProgress = async budget => {
    try {
      console.log('inside getporgress UserToken', userToken);
      const progressData = await getTotalDividedByBudgetAmount(
        userToken,
        budget.wallet,
        budget.category,
      );

      const progress = progressData[0];
      console.log(
        `Total divided by budget amount for ${budget.name} ${budget.id}:`,
        progress,
      );

      const budgetWithProgress = {...budget, progress};
      console.log('budgetWithProgress', budgets);
      const existingBudgetIndex = budgets.findIndex(b => b.id === budget.id);
      if (existingBudgetIndex === -1) {
        setBudgets(prevBudgets => [...prevBudgets, budgetWithProgress]);
      }
    } catch (error) {
      console.error(
        `Error fetching total divided by budget amount for ${budget.name}:`,
        error,
      );
    }
  };

  const renderItem = ({item}) => (
    console.log('item', budgets),
    (
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
    )
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
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    bottom: 40,
    right: -1,
  },
  // budgetItem: {
  //   backgroundColor: '#333136',
  //   marginVertical: 10,
  //   borderRadius: 5,
  // },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // paddingHorizontal: 20,
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
    // paddingHorizontal: 20,
    paddingBottom: 10,
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
