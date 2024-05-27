import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const BudgetDetail = ({route}) => {
  const {budget} = route.params;
  const navigation = useNavigation();

  const progress = budget.progress;
  let progressBarColor;
  if (progress >= 0.75) {
    progressBarColor = 'green';
  } else if (progress >= 0.3) {
    progressBarColor = 'yellow';
  } else {
    progressBarColor = 'red';
  }

  if (progress >= 0.7) {
    Alert.alert(
      'Budget Warning',
      `You have used ${Math.round(
        progress * 100,
      )}% of your budget. Spend Wisely`,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.goalName}>{budget.name}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Total Budget:</Text>
            <Text style={styles.detailValue}>{budget.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Used:</Text>
            <Text style={styles.detailValue}>{budget.amount * progress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Used Percentage:</Text>
            <Text style={styles.detailValue}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Remaining:</Text>
            <Text style={styles.detailValue}>
              {budget.amount - budget.amount * progress}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Remaining Percentage:</Text>
            <Text style={styles.detailValue}>
              {Math.round((1 - progress) * 100)}%
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Start Date:</Text>
            <Text style={styles.detailValue}>{budget.start_date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>End Date:</Text>
            <Text style={styles.detailValue}>{budget.end_date}</Text>
          </View>
          <View style={styles.progressBar}>
            <Progress.Bar
              progress={progress}
              width={330}
              color={progressBarColor}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  goalName: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#333136',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 18,
    color: 'white',
  },
  progressBar: {
    marginTop: 20,
  },
});

export default BudgetDetail;
