import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import {getAllTransactions, getAllWallets, getAllCategories} from '../api/api';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import reactNativeHTMLToPDF from 'react-native-html-to-pdf';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const {userToken} = useAuth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchWallets();
    fetchCategories();
  }, [selectedMonthIndex, currentYear]); // Update transactions when month or year changes

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
      fetchWallets();
      fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const categories = await getAllCategories(userToken);
      console.log('category', categories);
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

    const sortedTransactions = sortedDates.map(date => ({
      date,
      data: groupedTransactions[date],
    }));

    return sortedTransactions;
  };

  const renderTransactionItem = ({item}) => {
    if (!item) return null;

    const itemStyle = item.type === 'expense' ? styles.expense : styles.income;
    const amountText =
      item.type === 'expense' ? `-${item.amount}` : `+${item.amount}`;
    const amountColor = item.type === 'expense' ? '#EC4646' : 'green';
    const formattedTime = new Date(item.date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.transactionItem, itemStyle]}>
        <View>
          {categories.find(category => category.id === item.category) ? (
            <Text style={styles.category}>
              {categories.find(category => category.id === item.category)
                ?.category_name || 'Goals'}
            </Text>
          ) : (
            <Text style={styles.category}>Goals</Text>
          )}
          {wallets.find(wallet => wallet.id === item.wallet)?.name && (
            <Text style={styles.category1}>
              {wallets.find(wallet => wallet.id === item.wallet)?.name}
            </Text>
          )}
        </View>
        <View>
          <Text style={{color: amountColor, fontSize: 16}}>
            NPR{item.currency} {amountText}
          </Text>
          <Text style={styles.category1}>{formattedTime}</Text>
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

  const generatePDF = async () => {
    const options = {
      html: `
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-date {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .transaction {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 10px;
        }
        .transaction-info {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .transaction-info li {
          margin-bottom: 5px;
        }
      </style>
      <h1>${monthNames[selectedMonthIndex]} ${currentYear}</h1>
      <div>
        ${groupedTransactions
          .map(
            section => `
          <div class="section">
            <h2 class="section-date">${section.date}</h2>
            <ul>
              ${section.data
                .map(
                  transaction => `
                <li class="transaction">
                  <ul class="transaction-info">
                    <li><strong>Date:</strong> ${transaction.date}</li>
                    <li><strong>Amount:</strong> ${transaction.amount}</li>
                    <li><strong>Category:</strong> ${transaction.category}</li>
                    <li><strong>Notes:</strong> ${transaction.notes}</li>
                  </ul>
                </li>
              `,
                )
                .join('')}
            </ul>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
      fileName: `Transactions - ${Date.now()}`,
      directory: 'Documents',
    };
    const file = await reactNativeHTMLToPDF.convert(options);
    console.log(file);
  };

  return (
    <View style={styles.container}>
      {/* PDF Icon */}
      <TouchableOpacity style={styles.pdfIconContainer} onPress={generatePDF}>
        <AntDesign name="pdffile1" size={30} color="white" />
      </TouchableOpacity>
      {/* Month Selector */}
      <View style={styles.monthPicker}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.monthOption}>
          {monthNames[selectedMonthIndex]} {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <AntDesign name="right" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => renderTransactionItem({item})}
        renderSectionHeader={({section: {date}}) => (
          <Text style={styles.date}>{date}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 70,
    backgroundColor: '#1e1e1e',
  },
  pdfIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white',
  },
  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    color: 'white',
  },
  monthOption: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  expense: {
    backgroundColor: '#333136',
  },
  income: {
    backgroundColor: '#333136',
  },
  category: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  category1: {
    color: 'white',
  },
});

export default Transactions;
