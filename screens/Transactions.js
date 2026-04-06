import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Alert,
  StatusBar,
} from 'react-native';
import {getAllTransactions, getAllWallets, getAllCategories} from '../api/api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import reactNativeHTMLToPDF from 'react-native-html-to-pdf';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  income: '#16A34A',
  incomeSoft: '#DCFCE7',
  expense: '#EF4444',
  expenseSoft: '#FEE2E2',
  iconBg: '#EFF6FF',
};

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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const {userToken} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTransactions();
    fetchWallets();
    fetchCategories();
  }, [selectedMonthIndex, currentYear]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      fetchWallets();
      fetchCategories();
    }, [selectedMonthIndex, currentYear]),
  );

  const safeNumber = value => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const formatMoney = value => {
    return safeNumber(value).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const fetchWallets = async () => {
    try {
      const walletsData = await getAllWallets(userToken);
      setWallets(Array.isArray(walletsData) ? walletsData : []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWallets([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions(userToken);
      const filtered = (Array.isArray(data) ? data : []).filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          !Number.isNaN(transactionDate.getTime()) &&
          transactionDate.getMonth() === selectedMonthIndex &&
          transactionDate.getFullYear() === currentYear
        );
      });
      setTransactions(filtered);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories(userToken);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const walletsMap = useMemo(() => {
    const map = {};
    wallets.forEach(wallet => {
      map[wallet.id] = wallet;
    });
    return map;
  }, [wallets]);

  const groupedTransactions = useMemo(() => {
    const grouped = {};

    transactions.forEach(transaction => {
      const rawDate = new Date(transaction.date);
      if (Number.isNaN(rawDate.getTime())) {
        return;
      }

      const dateKey = rawDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(transaction);
    });

    const formatDate = date => {
      const parsed = new Date(date);
      return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
    };

    return Object.keys(grouped)
      .sort((a, b) => formatDate(b) - formatDate(a))
      .map(date => ({
        date,
        data: grouped[date],
      }));
  }, [transactions]);

  const incomeTotal = useMemo(() => {
    return transactions.reduce((acc, item) => {
      return item.type === 'income' ? acc + safeNumber(item.amount) : acc;
    }, 0);
  }, [transactions]);

  const expenseTotal = useMemo(() => {
    return transactions.reduce((acc, item) => {
      return item.type === 'expense' ? acc + safeNumber(item.amount) : acc;
    }, 0);
  }, [transactions]);

  const netFlow = incomeTotal - expenseTotal;

  const transactionCount = transactions.length;

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

  const getCategoryInfo = item => {
    if (item.category) {
      return {
        categoryName: item.category.category_name,
        categoryIcon: item.category.category_icon,
      };
    }
    if (item.custom) {
      return {
        categoryName: item.custom.category_name,
        categoryIcon: item.custom.category_icon,
      };
    }
    if (item.goal) {
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

  const generatePDF = async () => {
    const options = {
      html: `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        h2 { margin-bottom: 10px; }
        .section { margin-bottom: 24px; }
        .transaction {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 10px;
        }
      </style>
      <h1>${monthNames[selectedMonthIndex]} ${currentYear}</h1>
      ${groupedTransactions
        .map(
          section => `
          <div class="section">
            <h2>${section.date}</h2>
            ${section.data
              .map(
                transaction => `
                  <div class="transaction">
                    <p><strong>Amount:</strong> ${transaction.amount}</p>
                    <p><strong>Type:</strong> ${transaction.type}</p>
                    <p><strong>Date:</strong> ${transaction.date}</p>
                    <p><strong>Notes:</strong> ${transaction.notes || '-'}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        `,
        )
        .join('')}
      `,
      fileName: `Transactions-${monthNames[selectedMonthIndex]}-${currentYear}`,
      directory: 'Documents',
    };

    try {
      await reactNativeHTMLToPDF.convert(options);
      Alert.alert('Success', 'PDF file generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const renderTransactionItem = ({item}) => {
    if (!item) return null;

    const wallet = walletsMap[item.wallet?.id];
    const amount = safeNumber(item.amount);
    const isExpense = item.type === 'expense';
    const amountPrefix = isExpense ? '-' : '+';
    const amountColor = isExpense ? COLORS.expense : COLORS.income;

    const formattedTime = new Date(item.date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const {categoryName, categoryIcon} = getCategoryInfo(item);

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.transactionCard}
        onPress={() =>
          navigation.navigate('DeleteTransaction', {transaction: item})
        }>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isExpense
                ? COLORS.expenseSoft
                : COLORS.primarySoft,
            },
          ]}>
          <FontAwesome6
            name={categoryIcon}
            size={18}
            color={isExpense ? COLORS.expense : COLORS.primary}
          />
        </View>

        <View style={styles.transactionBody}>
          <View style={styles.transactionTopRow}>
            <Text style={styles.categoryText} numberOfLines={1}>
              {categoryName}
            </Text>
            <Text style={[styles.amountText, {color: amountColor}]}>
              {wallet?.currency || 'Rs'} {amountPrefix}
              {formatMoney(amount)}
            </Text>
          </View>

          <View style={styles.transactionBottomRow}>
            <Text style={styles.walletText} numberOfLines={1}>
              {wallet?.name || 'Unknown Wallet'}
            </Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({section: {date}}) => (
    <View style={styles.sectionHeaderWrap}>
      <Text style={styles.sectionHeader}>{date}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Transactions</Text>
                <Text style={styles.headerSubtitle}>
                  Review your monthly activity
                </Text>
              </View>

              <TouchableOpacity
                style={styles.pdfButton}
                activeOpacity={0.85}
                onPress={generatePDF}>
                <AntDesign name="pdffile1" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthCard}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handlePreviousMonth}>
                <AntDesign name="left" size={18} color={COLORS.primary} />
              </TouchableOpacity>

              <View style={styles.monthCenter}>
                <Text style={styles.monthLabel}>Selected Month</Text>
                <Text style={styles.monthValue}>
                  {monthNames[selectedMonthIndex]} {currentYear}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handleNextMonth}>
                <AntDesign name="right" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryRow}>
              <View
                style={[
                  styles.summaryCard,
                  {backgroundColor: COLORS.incomeSoft},
                ]}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryValue, {color: COLORS.income}]}>
                  Rs {formatMoney(incomeTotal)}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  {backgroundColor: COLORS.expenseSoft},
                ]}>
                <Text style={styles.summaryLabel}>Expense</Text>
                <Text style={[styles.summaryValue, {color: COLORS.expense}]}>
                  Rs {formatMoney(expenseTotal)}
                </Text>
              </View>
            </View>

            <View style={styles.overviewCard}>
              <View style={styles.overviewBlock}>
                <Text style={styles.overviewLabel}>Net Flow</Text>
                <Text
                  style={[
                    styles.overviewValue,
                    {color: netFlow >= 0 ? COLORS.income : COLORS.expense},
                  ]}>
                  Rs {formatMoney(netFlow)}
                </Text>
              </View>

              <View style={styles.overviewDivider} />

              <View style={styles.overviewBlock}>
                <Text style={styles.overviewLabel}>Transactions</Text>
                <Text style={styles.overviewValue}>{transactionCount}</Text>
              </View>
            </View>

            {groupedTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <AntDesign name="calendar" size={28} color={COLORS.subText} />
                <Text style={styles.emptyTitle}>No transactions found</Text>
                <Text style={styles.emptyText}>
                  There are no transactions for {monthNames[selectedMonthIndex]}{' '}
                  {currentYear}.
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.subText,
  },
  pdfButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  monthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCenter: {
    alignItems: 'center',
    flex: 1,
  },
  monthLabel: {
    fontSize: 13,
    color: COLORS.subText,
    marginBottom: 4,
  },
  monthValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.subText,
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  overviewBlock: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 13,
    color: COLORS.subText,
    marginBottom: 6,
    fontWeight: '600',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  overviewDivider: {
    width: 1,
    height: 42,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  sectionHeaderWrap: {
    paddingTop: 6,
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.subText,
  },
  transactionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionBody: {
    flex: 1,
  },
  transactionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginRight: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
  },
  walletText: {
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: COLORS.subText,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Transactions;
