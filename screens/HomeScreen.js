import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getAllWallets, getAllTransactions} from '../api/api';
import {useAuth} from '../api/authContext';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BarChart} from 'react-native-gifted-charts';

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
  walletCard: '#EEF4FF',
};

const HomeScreen = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const {userToken} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      fetchWallets();
      fetchTransactions();
    }, []),
  );

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
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const safeNumber = value => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const formatMoney = value => {
    const amount = safeNumber(value);
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const chartSummary = useMemo(() => {
    const monthlyData = {};

    transactions.forEach(transaction => {
      const amount = safeNumber(transaction.amount);
      const rawDate = transaction.date ? new Date(transaction.date) : null;

      if (!rawDate || Number.isNaN(rawDate.getTime())) {
        return;
      }

      const monthKey = `${rawDate.getFullYear()}-${rawDate.getMonth() + 1}`;
      const monthLabel = rawDate.toLocaleString('default', {month: 'short'});

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          label: monthLabel,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else if (transaction.type === 'expense') {
        monthlyData[monthKey].expense += amount;
      }
    });

    const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
      const [aYear, aMonth] = a.split('-').map(Number);
      const [bYear, bMonth] = b.split('-').map(Number);
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });

    const groupedData = sortedKeys.map(key => monthlyData[key]);

    const barData = groupedData.flatMap(item => [
      {
        value: item.income,
        label: item.label,
        spacing: 8,
        frontColor: COLORS.primary,
        labelTextStyle: styles.chartLabel,
        onPress: () =>
          showAlert(item.label, item.income || 0, item.expense || 0),
      },
      {
        value: item.expense,
        frontColor: COLORS.expense,
        onPress: () =>
          showAlert(item.label, item.income || 0, item.expense || 0),
      },
    ]);

    const maxBarValue = groupedData.reduce((max, item) => {
      return Math.max(max, item.income, item.expense);
    }, 0);

    return {
      barData,
      maxValue: maxBarValue > 0 ? Math.ceil(maxBarValue * 1.25) : 1000,
    };
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

  const totalBalance = useMemo(() => {
    return wallets.reduce((acc, wallet) => {
      const amount = Number(wallet.amount);
      return acc + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [wallets]);

  const showAlert = (month, income, expense) => {
    Alert.alert(
      `${month} Summary`,
      `Income: Rs ${formatMoney(income)}\nExpense: Rs ${formatMoney(expense)}`,
      [{text: 'OK'}],
    );
  };

  const renderLegend = () => {
    return (
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: COLORS.primary}]} />
          <Text style={styles.legendText}>Income</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: COLORS.expense}]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Track your cash flow and wallets
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total Balance</Text>
              <Text
                style={[
                  styles.heroAmount,
                  {color: totalBalance >= 0 ? COLORS.text : COLORS.expense},
                ]}>
                Rs {formatMoney(totalBalance)}
              </Text>
            </View>

            <View style={styles.heroBadge}>
              <AntDesign name="linechart" size={18} color={COLORS.primary} />
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View
              style={[styles.smallPill, {backgroundColor: COLORS.incomeSoft}]}>
              <Text style={[styles.smallPillText, {color: COLORS.income}]}>
                + Rs {formatMoney(incomeTotal)}
              </Text>
            </View>

            <View
              style={[styles.smallPill, {backgroundColor: COLORS.expenseSoft}]}>
              <Text style={[styles.smallPillText, {color: COLORS.expense}]}>
                - Rs {formatMoney(expenseTotal)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Income vs Expense</Text>
              <Text style={styles.cardSubtitle}>Monthly overview</Text>
            </View>
          </View>

          {renderLegend()}

          {chartSummary.barData.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={chartSummary.barData}
                barWidth={16}
                spacing={18}
                roundedTop
                roundedBottom
                noOfSections={4}
                maxValue={chartSummary.maxValue}
                hideRules={false}
                rulesColor="#E2E8F0"
                xAxisColor="#CBD5E1"
                yAxisColor="#CBD5E1"
                xAxisThickness={1}
                yAxisThickness={1}
                yAxisTextStyle={styles.yAxisText}
                isAnimated
                animationDuration={650}
                disablePress={false}
                initialSpacing={8}
                endSpacing={8}
                height={220}
              />
            </ScrollView>
          ) : (
            <View style={styles.emptyChart}>
              <AntDesign name="barschart" size={28} color={COLORS.subText} />
              <Text style={styles.emptyTitle}>No chart data yet</Text>
              <Text style={styles.emptyText}>
                Add income and expense transactions to see the graph.
              </Text>
            </View>
          )}
        </View>

        {/* <View style={styles.summaryRow}>
          <View
            style={[styles.summaryCard, {backgroundColor: COLORS.incomeSoft}]}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, {color: COLORS.income}]}>
              Rs {formatMoney(incomeTotal)}
            </Text>
          </View>

          <View
            style={[styles.summaryCard, {backgroundColor: COLORS.expenseSoft}]}>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={[styles.summaryValue, {color: COLORS.expense}]}>
              Rs {formatMoney(expenseTotal)}
            </Text>
          </View>
        </View> */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cash Flow</Text>

          <View style={styles.flowRow}>
            <Text style={styles.flowLabel}>Income</Text>
            <Text style={[styles.flowValue, {color: COLORS.income}]}>
              Rs {formatMoney(incomeTotal)}
            </Text>
          </View>

          <View style={styles.flowRow}>
            <Text style={styles.flowLabel}>Expense</Text>
            <Text style={[styles.flowValue, {color: COLORS.expense}]}>
              Rs {formatMoney(expenseTotal)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.flowRow}>
            <Text style={styles.flowTotalLabel}>Net Total</Text>
            <Text
              style={[
                styles.flowTotalValue,
                {color: totalBalance >= 0 ? COLORS.income : COLORS.expense},
              ]}>
              Rs {formatMoney(totalBalance)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.walletHeader}>
            <Text style={styles.cardTitle}>Wallets</Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate('AddWallet')}>
              <Text style={styles.viewAllText}>Add Wallet</Text>
            </TouchableOpacity> */}
          </View>

          {wallets.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.walletList}>
              {wallets.map(wallet => (
                <TouchableOpacity
                  key={wallet.id}
                  style={styles.walletCard}
                  activeOpacity={0.88}
                  onPress={() =>
                    navigation.navigate('DeleteWallet', {wallet: wallet})
                  }>
                  <View style={styles.walletIconWrap}>
                    {wallet.type === 'Cash' ? (
                      <FontAwesome6
                        name="money-bill"
                        size={18}
                        color={COLORS.primary}
                      />
                    ) : (
                      <AntDesign name="bank" size={18} color={COLORS.primary} />
                    )}
                  </View>

                  <Text style={styles.walletName} numberOfLines={1}>
                    {wallet.name}
                  </Text>

                  <Text style={styles.walletType}>{wallet.type}</Text>

                  <Text style={styles.walletAmount}>
                    {wallet.currency} {formatMoney(wallet.amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyWallets}>
              <AntDesign name="wallet" size={28} color={COLORS.subText} />
              <Text style={styles.emptyTitle}>No wallets found</Text>
              <Text style={styles.emptyText}>
                Create a wallet to start tracking your money.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 18,
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
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 14,
    color: COLORS.subText,
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 30,
    fontWeight: '800',
  },
  heroBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  smallPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.subText,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: COLORS.subText,
    fontSize: 14,
    fontWeight: '600',
  },
  chartLabel: {
    color: COLORS.subText,
    fontSize: 12,
  },
  yAxisText: {
    color: COLORS.subText,
    fontSize: 12,
  },
  emptyChart: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subText,
    textAlign: 'center',
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
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flowLabel: {
    fontSize: 16,
    color: COLORS.subText,
    fontWeight: '600',
  },
  flowValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  flowTotalLabel: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '800',
  },
  flowTotalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  walletList: {
    paddingTop: 16,
    paddingRight: 4,
  },
  walletCard: {
    width: 180,
    backgroundColor: COLORS.walletCard,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DCE8FF',
  },
  walletIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  walletName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  walletType: {
    fontSize: 13,
    color: COLORS.subText,
    marginTop: 4,
  },
  walletAmount: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  emptyWallets: {
    marginTop: 16,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
});

export default HomeScreen;
