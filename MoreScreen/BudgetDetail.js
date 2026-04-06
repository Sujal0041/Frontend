import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const BudgetDetail = ({route}) => {
  const {budget} = route.params;
  const navigation = useNavigation();

  const progress = budget.progress || 0;
  const usedAmount = budget.amount * progress;
  const remainingAmount = budget.amount - usedAmount;

  let progressBarColor;
  if (progress >= 0.75) {
    progressBarColor = '#22c55e';
  } else if (progress >= 0.3) {
    progressBarColor = '#f59e0b';
  } else {
    progressBarColor = '#ef4444';
  }

  useEffect(() => {
    if (progress >= 0.7) {
      Alert.alert(
        'Budget Warning',
        `You have used ${Math.round(
          progress * 100,
        )}% of your budget. Spend wisely.`,
      );
    }
  }, [progress]);

  const formatCurrency = value => {
    return `Rs ${Number(value).toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Budget Details</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <Text style={styles.goalName}>{budget.name}</Text>
          <Text style={styles.subtitle}>
            Track your budget usage and remaining balance
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Budget Usage</Text>
            <Text style={styles.progressPercent}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <Progress.Bar
            progress={progress}
            width={null}
            color={progressBarColor}
            unfilledColor="#e5e7eb"
            borderWidth={0}
            height={12}
            borderRadius={10}
            style={styles.progressBar}
          />

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Used</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(usedAmount)}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Remaining</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(remainingAmount)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Total Budget</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(budget.amount)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Used Percentage</Text>
            <Text style={styles.detailValue}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Remaining Percentage</Text>
            <Text style={styles.detailValue}>
              {Math.round((1 - progress) * 100)}%
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Start Date</Text>
            <Text style={styles.detailValue}>{budget.start_date}</Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <Text style={styles.detailTitle}>End Date</Text>
            <Text style={styles.detailValue}>{budget.end_date}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleCard: {
    marginBottom: 16,
  },
  goalName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  progressBar: {
    marginTop: 14,
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  detailTitle: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
});

export default BudgetDetail;
