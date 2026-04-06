import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import Wallets from '../screens/Wallets';
import {addGoal} from '../api/api';
import {useAuth} from '../api/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  inputBg: '#F8FAFC',
  danger: '#EF4444',
};

const AddGoal = ({modalVisible, setModalVisible, fetchGoals}) => {
  const [amount, setAmount] = useState('');
  const [goalName, setGoalName] = useState('');
  const [showWallets, setShowWallets] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const {userToken} = useAuth();

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const resetForm = () => {
    setAmount('');
    setGoalName('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleClose = () => {
    resetForm();
    setModalVisible(false);
  };

  const handleAddGoal = async () => {
    if (!amount || !goalName.trim()) {
      Alert.alert('Missing Details', 'Please enter amount and goal name.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert(
        'Invalid Dates',
        'End date cannot be earlier than start date.',
      );
      return;
    }

    try {
      await addGoal(
        {
          amount: parseFloat(amount),
          name: goalName.trim(),
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'ongoing',
        },
        userToken,
      );

      resetForm();
      setModalVisible(false);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('Error', 'Failed to add goal');
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

        {showWallets ? (
          <Wallets setShowWallets={setShowWallets} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleClose}>
                <AntDesign name="close" size={20} color={COLORS.text} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Add Goal</Text>

              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.heroCard}>
              <View style={styles.heroIconWrap}>
                <FontAwesome6
                  name="bullseye"
                  size={18}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>Create a new goal</Text>
                <Text style={styles.heroSubtitle}>
                  Set a target amount and timeline to track your progress.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Goal Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Goal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter goal name"
                  placeholderTextColor="#94A3B8"
                  value={goalName}
                  onChangeText={setGoalName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.pickerButtonText}>
                    {startDate.toLocaleDateString('en-US')}
                  </Text>
                  <AntDesign name="calendar" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.pickerButtonText}>
                    {endDate.toLocaleDateString('en-US')}
                  </Text>
                  <AntDesign name="calendar" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddGoal}>
                <Text style={styles.primaryButtonText}>Add Goal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleClose}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    fontSize: 15,
  },
  amountInput: {
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  pickerButton: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddGoal;
