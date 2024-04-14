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
import {ScrollView} from 'react-native-gesture-handler';

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
        day: 'numeric',
      });

      if (!groupedTransactions[dateKey]) {
        groupedTransactions[dateKey] = [];
      }

      groupedTransactions[dateKey].push(transaction);

      console.log('Before object', groupedTransactions);
    });

    const formatDate = date => {
      const dateParts = date.split(', '); // Split the date string
      const monthName = dateParts[0].split(' ')[0]; // Get the month name
      const day = dateParts[0].split(' ')[1]; // Get the day

      const year = dateParts[1]; // Get the year

      // Convert the month name to its corresponding number
      const monthNumber = monthNamesToNumber[monthName];

      // Format the date as "YYYY-MM-DD"
      const formattedDate = `${year}-${monthNumber}-${day}`;

      // Extract the date components from the strings
      return formattedDate;
    };

    const monthNamesToNumber = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
      const dateA = formatDate(a);
      const dateB = formatDate(b);

      return new Date(dateB) - new Date(dateA);
    });

    console.log('Dates:', sortedDates);

    const sortedTransactions = sortedDates.map(date => ({
      date,
      transactions: groupedTransactions[date],
    }));

    return sortedTransactions;
  };

  const renderTransactionItem = ({item}) => {
    console.log('Item:', item);
    if (!item) return null; // Add a check for undefined item

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

  console.log('Grouped transactions:', groupedTransactions);

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
      <ScrollView>
        {groupedTransactions.map(group => (
          <View key={group.date}>
            <Text style={styles.date}>{group.date}</Text>
            <FlatList
              data={group.transactions}
              renderItem={({item}) => renderTransactionItem({item})}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        ))}
      </ScrollView>
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
