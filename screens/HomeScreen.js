import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAllWallets, getAllTransactions} from '../api/api';
import {useAuth} from '../api/authContext';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {BarChart} from 'react-native-gifted-charts';

const HomeScreen = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const {userToken} = useAuth();

  useEffect(() => {
    fetchWallets();
    fetchTransactions();

    const handleBackPress = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchWallets();
      fetchTransactions();
    }, []),
  );

  const fetchWallets = async () => {
    try {
      const walletsData = await getAllWallets(userToken);
      setWallets(walletsData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      // Handle error, e.g., show error message to user
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions(userToken);
      setTransactions(data);
      return data;
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const maxIncome = Math.max(
    ...transactions.map(item => parseFloat(item.amount)),
  );
  const maxExpense = Math.max(
    ...transactions.map(item => parseFloat(item.amount)),
  );

  // Calculate the maximum value for the y-axis, rounded up to the nearest 1000
  const maxYAxisValue =
    Math.ceil(Math.max(maxIncome, maxExpense) / 5000) * 5000;

  const getBarChartData = () => {
    const monthlyData = {};

    // Group transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const monthName = date.toLocaleString('default', {month: 'short'}); // Get abbreviated month name

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {income: 0, expense: 0, label: monthName}; // Include month name in data
      }

      if (transaction.type === 'income') {
        monthlyData[monthYear].income += parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
        monthlyData[monthYear].expense += parseFloat(transaction.amount);
      }
    });

    // Sort the keys of monthlyData
    const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.split('-').map(Number);
      const [bMonth, bYear] = b.split('-').map(Number);
      if (aYear !== bYear) {
        return aYear - bYear;
      }
      return aMonth - bMonth;
    });

    // Convert sorted keys into sorted monthlyData object
    const sortedMonthlyData = {};
    sortedKeys.forEach(key => {
      console.log(key);
      sortedMonthlyData[key] = monthlyData[key];
      console.log(sortedMonthlyData);
      console.log(monthlyData);
    });

    // Convert monthlyData into barData format
    const barData = [];

    // Iterate through each month and push income and expense data alternately
    Object.keys(sortedMonthlyData).forEach(key => {
      console.log(key);
      barData.push({
        value: sortedMonthlyData[key].income,
        label: sortedMonthlyData[key].label, // Use month name as label
        spacing: 10,
        labelWidth: 50,
        labelTextStyle: {color: 'gray'},
        frontColor: '#177AD5', // Income color
      });

      barData.push({
        value: sortedMonthlyData[key].expense,
        frontColor: '#ED6665', // Expense color
      });
    });

    return barData;
  };

  const renderTitle = () => {
    return (
      <View style={{marginVertical: 20}}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'left',
            position: 'absolute',
            left: 100,
            top: -10,
          }}>
          Income vs Expense
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'center',
            marginTop: 24,
            marginLeft: 110,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 6,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 18,
                color: 'white',
                // marginRight: 400,
              }}>
              Income
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#ED6665',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 18,
                color: 'white',
              }}>
              Expense
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.dashboard}>
          <Text style={styles.text}>Dashboard</Text>
          <View
            style={{
              backgroundColor: '#333340',
              paddingBottom: 10,
              borderRadius: 10,
            }}>
            {renderTitle()}
            <BarChart
              data={getBarChartData()}
              barWidth={10}
              spacing={20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{color: 'white'}}
              maxValue={maxYAxisValue}
            />
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <Text style={styles.text2}>Cash Flow</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.text3]}>Income</Text>
            <Text style={[styles.text3, {color: '#28a745'}]}>
              Rs{' '}
              {transactions.reduce((acc, curr) => {
                return curr.type === 'income'
                  ? acc + parseFloat(curr.amount)
                  : acc;
              }, 0)}{' '}
              NPR
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.text3]}>Expense</Text>
            <Text style={[styles.text3, {color: '#EC4646'}]}>
              Rs{' '}
              {transactions.reduce((acc, curr) => {
                return curr.type === 'expense'
                  ? acc + parseFloat(curr.amount)
                  : acc;
              }, 0)}{' '}
              NPR
            </Text>
          </View>

          <Text style={[{paddingLeft: 1, marginTop: -8}, styles.text3]}>
            ___________________________________________________
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.text3]}>Total</Text>
            <Text
              style={[
                styles.text3,
                {color: '#28a745'}, // Green color for positive total
              ]}>
              Rs{' '}
              {transactions.reduce((acc, curr) => {
                return curr.type === 'income'
                  ? acc + parseFloat(curr.amount)
                  : acc - parseFloat(curr.amount); // Subtract expense from income
              }, 0)}{' '}
              NPR
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.boxWallet}>
        <Text style={styles.text2}> Wallets</Text>
        <ScrollView
          horizontal
          style={styles.walletBox}
          contentContainerStyle={{justifyContent: 'space-between'}}>
          {wallets.map(wallet => (
            <View key={wallet.id} style={styles.WalletsBox}>
              {wallet.type === 'Cash' ? (
                <FontAwesomeIcon
                  name="money-bill"
                  size={22}
                  color="white"
                  style={{marginBottom: 2}}
                />
              ) : (
                <AntDesignIcon
                  name="bank"
                  size={22}
                  color="white"
                  style={{marginBottom: 2}}
                />
              )}
              <Text style={[styles.text3]}>{wallet.name}</Text>
              <Text style={[styles.text1, {fontSize: 18}]}>
                {wallet.amount}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'white',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dashboard: {
    width: 1000,
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'white',
    backgroundColor: '#333340',
    // marginVertical: 10,
    paddingLeft: 10,
    position: 'relative',
    right: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 30,
    color: 'white',
  },
  text2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  text3: {
    fontSize: 16,
    color: 'white',
  },
  box: {
    width: '100%',
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'white',
    backgroundColor: '#333340',
    marginVertical: 10,
  },
  boxWallet: {
    width: '100%',
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'white',
    backgroundColor: '#333340',
  },
  walletBox: {
    height: 200,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: 'white',
    backgroundColor: '#333340',
  },
  inner: {
    flex: 1,
    padding: 5,
  },
  inner2: {
    flex: 1,
  },
  WalletsBox: {
    height: 100,
    width: 150,
    borderWidth: 0.1,
    borderColor: 'white',
    marginRight: 20,
    borderRadius: 10,
    padding: 5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333136',
  },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#177AD5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
