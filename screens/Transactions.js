import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import {getAllTransactions, getAllWallets, getAllCategories} from '../api/api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import reactNativeHTMLToPDF from 'react-native-html-to-pdf';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const {userToken} = useAuth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTransactions();
    fetchWallets();
    fetchCategories();
  }, [selectedMonthIndex, currentYear]);

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
      const dateParts = date.split(', ');
      const monthName = dateParts[0].split(' ')[0];
      const day = dateParts[0].split(' ')[1];
      const year = dateParts[1];

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

      const monthNumber = monthNamesToNumber[monthName];
      const formattedDate = `${year}-${monthNumber}-${day}`;

      return formattedDate;
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

    const getCategoryInfo = () => {
      if (item.category) {
        return {
          categoryName: item.category.category_name,
          categoryIcon: item.category.category_icon,
        };
      } else if (item.custom) {
        return {
          categoryName: item.custom.category_name,
          categoryIcon: item.custom.category_icon,
        };
      } else if (item.goal) {
        return {
          categoryName: 'Goal',
          categoryIcon: 'flag-checkered',
        };
      }
      return {
        categoryName: 'Unknown Category',
        categoryIcon: 'question-circle',
      };
    };

    const {categoryName, categoryIcon} = getCategoryInfo();

    return (
      <TouchableOpacity
        style={[styles.transactionItem, itemStyle, {marginRight: 10}]}
        onPress={() =>
          navigation.navigate('DeleteTransaction', {transaction: item})
        }>
        <FontAwesomeIcon
          name={categoryIcon}
          size={22}
          color="white"
          style={styles.icon}
        />
        <View style={styles.transactionDetails}>
          <View>
            <Text style={styles.category}>{categoryName}</Text>
            {wallets.find(wallet => wallet.id === item.wallet.id)?.name && (
              <Text style={styles.category1}>
                {wallets.find(wallet => wallet.id === item.wallet.id)?.name}
              </Text>
            )}
          </View>
          <View>
            <Text style={{color: amountColor, fontSize: 16}}>
              {wallets.find(wallet => wallet.id === item.wallet.id)?.currency}{' '}
              {amountText}
            </Text>
            <Text style={styles.category1}>{formattedTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
      fileName: `Sujal Transactions - ${Date.now()}`,
      directory: 'Documents',
    };
    const file = await reactNativeHTMLToPDF.convert(options);
    console.log(file);

    Alert.alert('Success', 'PDF file generated successfully');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pdfIconContainer} onPress={generatePDF}>
        <AntDesign name="pdffile1" size={30} color="white" />
      </TouchableOpacity>
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
        keyExtractor={(item, index) => item.id + index}
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
    zIndex: 1,
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
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#333136',
  },
  icon: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
