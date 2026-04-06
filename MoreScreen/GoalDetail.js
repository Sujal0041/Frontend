import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const GoalDetail = ({route}) => {
  const {goal, goalNumber, progress = 0} = route.params;
  const navigation = useNavigation();

  const totalAmount = Number(goal.amount) || 0;
  const savedAmount = totalAmount * progress;
  const remainingAmount = totalAmount - savedAmount;
  const savedPercentage = Math.round(progress * 100);
  const remainingPercentage = Math.max(0, 100 - savedPercentage);

  const getProgressColor = value => {
    if (value >= 0.75) {
      return COLORS.success;
    }
    if (value >= 0.3) {
      return COLORS.warning;
    }
    return COLORS.danger;
  };

  const progressBarColor = getProgressColor(progress);

  const formatAmount = value => {
    return Number(value).toFixed(2);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Goal Details</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <FontAwesome6 name="bullseye" size={18} color={COLORS.primary} />
          </View>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>{goal.name}</Text>
            <Text style={styles.heroSubtitle}>
              Goal #{goalNumber} • Track your savings progress and remaining
              target.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount to Save</Text>
            <Text style={styles.detailValue}>{formatAmount(totalAmount)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Saved</Text>
            <Text style={styles.detailValue}>{formatAmount(savedAmount)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Saved Percentage</Text>
            <Text style={styles.detailValue}>{savedPercentage}%</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Remaining</Text>
            <Text style={styles.detailValue}>
              {formatAmount(remainingAmount)}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <Text style={styles.detailLabel}>Remaining Percentage</Text>
            <Text style={styles.detailValue}>{remainingPercentage}%</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Savings Progress</Text>
              <Text style={styles.progressPercent}>{savedPercentage}%</Text>
            </View>

            <Progress.Bar
              progress={progress}
              width={null}
              height={12}
              borderWidth={0}
              color={progressBarColor}
              unfilledColor="#E2E8F0"
              style={styles.progressBar}
            />
          </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  headerSpacer: {
    width: 42,
    height: 42,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
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
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 18,
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  lastRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.subText,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  progressBar: {
    width: '100%',
  },
});

export default GoalDetail;
