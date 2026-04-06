import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AddGoal from '../MoreScreen/AddGoals';
import {getGoalList, getGoalProgress} from '../api/api';
import {useAuth} from '../api/authContext';
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
  muted: '#94A3B8',
};

const Goals = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [progressData, setProgressData] = useState({});
  const {userToken} = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [userToken]),
  );

  const fetchGoals = async () => {
    try {
      const goalsData = await getGoalList(userToken);
      setGoals(goalsData || []);

      const progressPromises = (goalsData || []).map(goal =>
        getGoalProgress(
          userToken,
          goal.id,
          goal.start_date,
          goal.end_date,
        ).then(progressData => {
          let rawValue = 0;
          if (Array.isArray(progressData)) {
            rawValue = progressData[0] || 0;
          } else if (progressData && typeof progressData === 'object') {
            rawValue = progressData.progress ?? progressData.percentage ?? 0;
          } else {
            rawValue = progressData || 0;
          }

          // Ensure progress is a decimal (0-1)
          const finalProgress =
            Number(rawValue) > 1 ? Number(rawValue) / 100 : Number(rawValue);

          return {
            id: goal.id,
            progress: Math.max(0, Math.min(finalProgress, 1)),
          };
        }),
      );

      const progressResults = await Promise.all(progressPromises);

      const progressDataMap = progressResults.reduce((acc, item) => {
        acc[item.id] = item.progress;
        return acc;
      }, {});

      setProgressData(progressDataMap);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const ongoingGoals = goals.filter(goal => goal.status === 'ongoing');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  const getProgressColor = progress => {
    if (progress >= 0.75) {
      return COLORS.success;
    }
    if (progress >= 0.3) {
      return COLORS.warning;
    }
    return COLORS.danger;
  };

  const renderGoalCard = ({item, index}) => {
    const progress = progressData[item.id] || 0;
    const progressColor = getProgressColor(progress);
    const percentage = Math.round(progress * 100);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.goalCard,
          item.status === 'completed' && styles.completedGoalCard,
        ]}
        onPress={() =>
          navigation.navigate('GoalDetail', {
            goal: item,
            goalNumber: index + 1,
            progress,
          })
        }>
        <View style={styles.goalTopRow}>
          <View style={styles.goalIconWrap}>
            <FontAwesome6
              name={item.status === 'completed' ? 'flag-checkered' : 'bullseye'}
              size={16}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.goalTextWrap}>
            <Text
              style={[
                styles.goalName,
                item.status === 'completed' && styles.completedGoalName,
              ]}>
              {item.name}
            </Text>
            <Text style={styles.goalSubtext}>
              {item.status === 'completed'
                ? 'Completed goal'
                : `${percentage}% completed`}
            </Text>
          </View>

          <AntDesign name="right" size={16} color={COLORS.muted} />
        </View>

        <View style={styles.progressWrap}>
          <Progress.Bar
            progress={progress}
            width={null}
            height={10}
            borderWidth={0}
            unfilledColor="#E2E8F0"
            color={progressColor}
            style={styles.progressBar}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = title => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderEmptyState = message => (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );

  const listData = [
    {type: 'header'},
    {type: 'hero'},
    {type: 'section', title: 'Ongoing Goals'},
    ...(ongoingGoals.length
      ? ongoingGoals.map(item => ({type: 'goal', data: item}))
      : [{type: 'empty', message: 'No ongoing goals'}]),
    {type: 'section', title: 'Completed Goals'},
    ...(completedGoals.length
      ? completedGoals.map(item => ({type: 'goal', data: item}))
      : [{type: 'empty', message: 'No completed goals'}]),
  ];

  let ongoingIndex = 0;
  let completedIndex = 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <FlatList
        data={listData}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => {
          if (item.type === 'header') {
            return (
              <View style={styles.header}>
                <View style={styles.headerSpacer} />
                <Text style={styles.headerTitle}>Goals</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setModalVisible(true)}>
                  <AntDesign name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          }

          if (item.type === 'hero') {
            return (
              <View style={styles.heroCard}>
                <View style={styles.heroIconWrap}>
                  <FontAwesome6
                    name="chart-line"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.heroTextWrap}>
                  <Text style={styles.heroTitle}>Track your goals</Text>
                  <Text style={styles.heroSubtitle}>
                    Stay focused on your progress, review completed milestones,
                    and add new goals anytime.
                  </Text>
                </View>
              </View>
            );
          }

          if (item.type === 'section') {
            return renderSectionHeader(item.title);
          }

          if (item.type === 'empty') {
            return renderEmptyState(item.message);
          }

          if (item.type === 'goal') {
            const goal = item.data;
            const index =
              goal.status === 'ongoing' ? ongoingIndex++ : completedIndex++;
            return renderGoalCard({item: goal, index});
          }

          return null;
        }}
      />

      <AddGoal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        fetchGoals={fetchGoals}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 10,
  },
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  completedGoalCard: {
    opacity: 0.75,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalTextWrap: {
    flex: 1,
  },
  goalName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  completedGoalName: {
    textDecorationLine: 'line-through',
    color: COLORS.subText,
  },
  goalSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.subText,
    fontWeight: '600',
  },
  progressWrap: {
    marginTop: 14,
  },
  progressBar: {
    width: '100%',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyMessage: {
    fontSize: 15,
    color: COLORS.subText,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Goals;
