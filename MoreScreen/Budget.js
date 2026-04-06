import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import * as Progress from 'react-native-progress';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AddBudget from './AddBudget';
import {getBudgetList, getTotalDividedByBudgetAmount} from '../api/api';
import {useAuth} from '../api/authContext';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#EF4444',
};

const Budget = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const {userToken} = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!userToken) {
        return;
      }

      fetchBudgets();
    }, [userToken]),
  );

  const fetchBudgets = async () => {
    try {
      const data = await getBudgetList(userToken);

      const budgetWithProgressPromises = data.map(async budget => {
        const categoryId = budget.custom || budget.category;

        if (!categoryId) {
          return {...budget, progress: 0};
        }

        // Pass dates to ensure progress is only calculated for the budget's duration
        const progressData = await getTotalDividedByBudgetAmount(
          userToken,
          budget.wallet?.id || budget.wallet,
          categoryId?.id || categoryId,
          budget.start_date,
          budget.end_date,
        );

        // Handle both array and object responses from backend
        // If it's an array, take the first element. If it's an object, check for 'percentage' or 'progress'.
        let rawValue = 0;
        if (Array.isArray(progressData)) {
          rawValue = progressData[0] || 0;
        } else if (progressData && typeof progressData === 'object') {
          rawValue = progressData.percentage ?? progressData.progress ?? 0;
        } else {
          rawValue = progressData || 0;
        }

        // Convert percentage (0-100) to decimal (0-1) if needed
        const safeProgress = Math.max(0, Math.min(Number(rawValue) > 1 ? Number(rawValue) / 100 : Number(rawValue), 1));

        return {
          ...budget,
          progress: safeProgress,
          totalSpent: progressData?.total_spent ?? 0,
          budgetAmount: progressData?.budget_amount ?? budget.amount,
        };
      });

      const budgetsWithProgress = await Promise.all(budgetWithProgressPromises);
      setBudgets(budgetsWithProgress);
    } catch (error) {
      console.error(error);
      setBudgets([]);
    }
  };

  const getProgressColor = progress => {
    if (progress >= 1) return COLORS.danger;
    if (progress >= 0.75) return COLORS.warning;
    return COLORS.success;
  };

  const renderItem = ({item}) => {
    const progressValue = item.progress || 0;
    const progressPercent = (progressValue * 100).toFixed(0);
    const progressColor = getProgressColor(progressValue);

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.budgetCard}
        onPress={() => navigation.navigate('BudgetDetail', {budget: item})}>
        <View style={styles.cardTopRow}>
          <View style={styles.iconWrap}>
            <AntDesign name="wallet" size={18} color={COLORS.primary} />
          </View>

          <View style={styles.cardTextWrap}>
            <Text style={styles.budgetName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.budgetSubtitle}>Planned budget</Text>
          </View>

          <View style={styles.amountWrap}>
            <Text style={styles.budgetAmount}>Rs {item.amount}</Text>
            <Text style={[styles.progressText, {color: progressColor}]}>
              {progressPercent}%
            </Text>
          </View>
        </View>

        <View style={styles.progressMetaRow}>
          <Text style={styles.progressMetaLabel}>Usage</Text>
          <Text style={[styles.progressMetaValue, {color: progressColor}]}>
            {progressValue >= 1 ? 'Limit reached' : `${progressPercent}% used`}
          </Text>
        </View>

        <Progress.Bar
          progress={progressValue}
          width={null}
          height={10}
          borderWidth={0}
          color={progressColor}
          unfilledColor="#E5E7EB"
          borderRadius={999}
          style={styles.progressBar}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Budgets</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <AntDesign name="barschart" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Track your budgets</Text>
              <Text style={styles.heroSubtitle}>
                Keep spending under control and monitor progress at a glance.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <AntDesign name="inbox" size={28} color={COLORS.subText} />
            <Text style={styles.emptyTitle}>No budgets yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first budget to start monitoring your spending.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyButtonText}>Add Budget</Text>
            </TouchableOpacity>
          </View>
        }
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
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 6,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
  },
  budgetCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  budgetSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.subText,
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
  },
  progressMetaRow: {
    marginTop: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressMetaLabel: {
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: '600',
  },
  progressMetaValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default Budget;
