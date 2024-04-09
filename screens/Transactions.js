import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {getAllTransactions, getAllWallets} from '../api/api';
import {useFocusEffect} from '@react-navigation/native';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTransactions();
    fetchWallet();
  }, [selectedMonthIndex, currentYear]); // Update transactions when month or year changes

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
      fetchWallet();
    }, []),
  );

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(
        data.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === selectedMonthIndex &&
            transactionDate.getFullYear() === currentYear
          );
        }),
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchWallet = async () => {
    try {
      const wallets = await getAllWallets();
      setWallet(wallets[0]);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const groupTransactionsByDate = () => {
    const groupedTransactions = {};

    transactions.forEach(transaction => {
      const dateKey = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      if (!groupedTransactions[dateKey]) {
        groupedTransactions[dateKey] = [];
      }

      groupedTransactions[dateKey].push(transaction);
    });

    // Sort transactions within each group by date in descending order
    Object.keys(groupedTransactions).forEach(key => {
      groupedTransactions[key].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
    });

    return groupedTransactions;
  };

  const renderTransactionItem = ({item}) => {
    const itemStyle = item.type === 'expense' ? styles.expense : styles.income;
    const amountText =
      item.type === 'expense' ? `-${item.amount}` : `+${item.amount}`;
    const amountColor = item.type === 'expense' ? 'red' : 'green';
    const formattedTime = new Date(item.date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.transactionItem, itemStyle]}>
        <View>
          <Text style={styles.category}>{item.category}</Text>
          <Text>{item.notes}</Text>
        </View>
        <View>
          <Text style={{color: amountColor, fontSize: 16}}>
            {item.currency} {amountText}
          </Text>
          <Text>{formattedTime}</Text>
        </View>
      </View>
    );
  };

  const groupedTransactions = groupTransactionsByDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePreviousMonth = () => {
    setSelectedMonthIndex(prevIndex => (prevIndex === 0 ? 11 : prevIndex - 1));
    if (selectedMonthIndex === 0) {
      setCurrentYear(prevYear => prevYear - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex(prevIndex => (prevIndex === 11 ? 0 : prevIndex + 1));
    if (selectedMonthIndex === 11) {
      setCurrentYear(prevYear => prevYear + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Month Selector */}
      <View style={styles.monthPicker}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthOption}>
          {monthNames[selectedMonthIndex]} {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {selectedMonthIndex >= 0 && (
        <FlatList
          data={Object.entries(groupedTransactions)}
          renderItem={({item}) => (
            <>
              <Text style={styles.date}>{item[0]}</Text>
              <FlatList
                data={item[1]}
                renderItem={renderTransactionItem}
                keyExtractor={transaction => transaction.id.toString()}
              />
            </>
          )}
          keyExtractor={item => item[0]} // Use date as the key
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 70,
  },
  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthOption: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  expense: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  income: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  category: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Transactions;
