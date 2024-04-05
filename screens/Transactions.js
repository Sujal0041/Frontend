import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import {getAllTransactions, getAllWallets} from '../api/api';
import {useFocusEffect} from '@react-navigation/native';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchWallet();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
      fetchWallet();
    }, []),
  );

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
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
      const dateKey = new Date(transaction.date).toLocaleDateString('en-US');
      if (!groupedTransactions[dateKey]) {
        groupedTransactions[dateKey] = [];
      }
      groupedTransactions[dateKey].push(transaction);
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

  return (
    <View style={styles.container}>
      {wallet && (
        <View style={styles.walletInfo}>
          <Text style={styles.walletName}>{wallet.name}</Text>
          <Text style={styles.walletAmount}>Amount: {wallet.amount}</Text>
        </View>
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  walletInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  walletName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  walletAmount: {
    fontSize: 16,
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
