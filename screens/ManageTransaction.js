import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import {addTransaction} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import {useRoute, useNavigation} from '@react-navigation/native';
import Wallets from './Wallets';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  getGoalCategoryRemoved,
  getCategory,
  getCustomCategory,
} from '../api/api';
import {useAuth} from '../api/authContext';

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
  danger: '#DC2626',
};

const ManageTransaction = ({modalVisible, setModalVisible}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const {userToken} = useAuth();

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionType, setTransactionType] = useState('Income');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);
  const [wallet, setWallet] = useState('');
  const [showWallets, setShowWallets] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  const [allCategories, setAllCategories] = useState([]);
  const [allCustom, setAllCustom] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [combinedCategories, setCombinedCategories] = useState([]);

  const accentColor =
    transactionType === 'Income' ? COLORS.income : COLORS.expense;
  const accentSoft =
    transactionType === 'Income' ? COLORS.incomeSoft : COLORS.expenseSoft;

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  useEffect(() => {
    if (route.params && route.params.selectedWallet) {
      setWallet(route.params.selectedWallet);
    }
    if (route.params && typeof route.params.showWallets !== 'undefined') {
      setShowWallets(route.params.showWallets);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategory(userToken);
        const custom = await getCustomCategory(userToken);
        const merged = [...categories, ...custom];
        setAllCategories(merged);
        setAllCustom(custom);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchGoals = async () => {
      try {
        const goals = await getGoalCategoryRemoved(userToken);
        setAllGoals(goals);
      } catch (error) {
        console.error('Error fetching goal categories:', error);
      }
    };

    if (modalVisible) {
      fetchCategories();
      fetchGoals();
    }
  }, [modalVisible, userToken]);

  useEffect(() => {
    const mappedCategories = allCategories.map(item => ({
      category_name: item.category_name,
      id: item.id,
      type: allCustom.some(custom => custom.id === item.id) ? 'custom' : 'category',
      value: `${allCustom.some(custom => custom.id === item.id) ? 'custom' : 'category'}-${item.id}`,
    }));

    let combined = mappedCategories;

    if (transactionType === 'Expense') {
      const mappedGoals = allGoals.map(goal => ({
        category_name: goal.name,
        id: goal.id,
        type: 'goal',
        value: `goal-${goal.id}`,
      }));
      combined = [...combined, ...mappedGoals];
    }

    const categoryMap = new Map();

    combined.forEach(cat => {
      if (!categoryMap.has(cat.value)) {
        categoryMap.set(cat.value, cat);
      }
    });

    setCombinedCategories(Array.from(categoryMap.values()));
  }, [transactionType, allCategories, allCustom, allGoals]);

  const dropdownData = useMemo(() => {
    return combinedCategories.map(item => ({
      label: item.category_name,
      value: item.value,
    }));
  }, [combinedCategories]);

  const handleWalletSelection = selectedWallet => {
    setWallet(selectedWallet);
    setShowWallets(false);
  };

  const resetForm = () => {
    setAmount('');
    setNotes('');
    setWallet('');
    setSelectedCategoryKey('');
    setDate(new Date());
    setTransactionType('Income');
    setIsFormValid(true);
  };

  const handleAddTransaction = async () => {
    if (!amount || !notes || !selectedCategoryKey || !wallet) {
      setIsFormValid(false);
      return;
    }

    let transactionCategory = {
      category: null,
      custom: null,
      goal: null,
    };

    const selectedCategory = combinedCategories.find(
      item => item.value === selectedCategoryKey,
    );

    if (selectedCategory?.type === 'category') {
      transactionCategory.category = selectedCategory.id;
    } else if (selectedCategory?.type === 'custom') {
      transactionCategory.custom = selectedCategory.id;
    } else if (selectedCategory?.type === 'goal') {
      transactionCategory.goal = selectedCategory.id;
    }

    const transactionData = {
      amount: parseFloat(amount),
      notes: notes.trim(),
      type: transactionType.toLowerCase(),
      wallet: wallet.id,
      date,
      ...transactionCategory,
    };

    try {
      await addTransaction(transactionData, userToken);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const closeModal = () => {
    setIsFormValid(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowWallets(false);
    setModalVisible(false);
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {showWallets ? (
        <Wallets
          handleWalletSelection={handleWalletSelection}
          setShowWallets={setShowWallets}
        />
      ) : (
        <View style={styles.screen}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.headerButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Add Transaction</Text>

              <View style={styles.headerIconPlaceholder} />
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>New Entry</Text>
              <Text style={styles.heroTitle}>Track your money clearly</Text>
              <Text style={styles.heroSubtext}>
                Add income or expense with category, wallet, and time.
              </Text>
            </View>

            <View style={styles.segmentWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.segmentButton,
                  transactionType === 'Income' && {
                    backgroundColor: COLORS.incomeSoft,
                    borderColor: COLORS.income,
                  },
                ]}
                onPress={() => setTransactionType('Income')}>
                <Text
                  style={[
                    styles.segmentText,
                    transactionType === 'Income' && {color: COLORS.income},
                  ]}>
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.segmentButton,
                  transactionType === 'Expense' && {
                    backgroundColor: COLORS.expenseSoft,
                    borderColor: COLORS.expense,
                  },
                ]}
                onPress={() => setTransactionType('Expense')}>
                <Text
                  style={[
                    styles.segmentText,
                    transactionType === 'Expense' && {color: COLORS.expense},
                  ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Amount</Text>
              <View
                style={[
                  styles.amountCard,
                  {backgroundColor: accentSoft, borderColor: accentColor},
                ]}>
                <Text style={[styles.amountSign, {color: accentColor}]}>
                  {transactionType === 'Income' ? '+' : '-'}
                </Text>
                <TextInput
                  style={[styles.amountInput, {color: accentColor}]}
                  placeholder="0"
                  placeholderTextColor={accentColor}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a short note"
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
              />

              <Text style={styles.fieldLabel}>Category</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isCategoryFocus && {borderColor: COLORS.primary},
                ]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                data={dropdownData}
                labelField="label"
                valueField="value"
                placeholder={!isCategoryFocus ? 'Select category' : '...'}
                value={selectedCategoryKey}
                onFocus={() => setIsCategoryFocus(true)}
                onBlur={() => setIsCategoryFocus(false)}
                onChange={item => {
                  setSelectedCategoryKey(item.value);
                  setIsCategoryFocus(false);
                }}
              />

              <Text style={styles.fieldLabel}>Wallet</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                activeOpacity={0.88}
                onPress={() => setShowWallets(true)}>
                <View style={styles.selectorLeft}>
                  <View style={styles.selectorIcon}>
                    <AntDesign name="wallet" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.selectorTitle}>Account</Text>
                </View>
                <Text style={styles.selectorValue}>
                  {wallet?.name || 'Select Wallet'}
                </Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.fieldLabel}>Date</Text>
                  <TouchableOpacity
                    style={styles.selectorButton}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.selectorValueDark}>
                      {date.toLocaleDateString('en-US')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.half}>
                  <Text style={styles.fieldLabel}>Time</Text>
                  <TouchableOpacity
                    style={styles.selectorButton}
                    onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.selectorValueDark}>
                      {date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.addButton, {backgroundColor: accentColor}]}
              activeOpacity={0.9}
              onPress={handleAddTransaction}>
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </ScrollView>

          {!isFormValid && (
            <View style={styles.warningOverlay}>
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>Missing details</Text>
                <Text style={styles.warningText}>
                  Please fill amount, notes, category, and wallet before adding
                  the transaction.
                </Text>
                <TouchableOpacity
                  onPress={() => setIsFormValid(true)}
                  style={styles.dismissButton}>
                  <Text style={styles.dismissButtonText}>Got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={date}
              mode="time"
              is24Hour
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerButton: {
    minWidth: 70,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerIconPlaceholder: {
    width: 70,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroSubtext: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
  },
  segmentWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 6,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.subText,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.subText,
    marginBottom: 8,
    marginTop: 8,
  },
  amountCard: {
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountSign: {
    fontSize: 28,
    fontWeight: '900',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    paddingVertical: 0,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    color: COLORS.text,
  },
  dropdown: {
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 4,
  },
  dropdownPlaceholder: {
    color: '#94A3B8',
    fontSize: 15,
  },
  dropdownSelectedText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  selectorButton: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  selectorValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.subText,
  },
  selectorValueDark: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  half: {
    flex: 1,
  },
  addButton: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  warningOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  warningCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.subText,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 18,
  },
  dismissButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default ManageTransaction;
