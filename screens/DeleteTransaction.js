import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import {
  getAllCategories,
  getAllWallets,
  updateTransaction,
  deleteTransactions,
} from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  inputBg: '#F8FAFC',
  success: '#16A34A',
  danger: '#EF4444',
  warning: '#F59E0B',
};

const EditTransaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {transaction} = route.params || {};
  const {userToken} = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [walletName, setWalletName] = useState('');
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const typeOptions = [
    {label: 'Income', value: 'income'},
    {label: 'Expense', value: 'expense'},
  ];

  useEffect(() => {
    if (!transaction) {
      return;
    }

    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedWallets] = await Promise.all([
          getAllCategories(userToken),
          getAllWallets(userToken),
        ]);

        setCategories(fetchedCategories || []);
        setWallets(fetchedWallets || []);

        setCategoryName(transaction.category?.category_name || '');
        setWalletName(transaction.wallet?.name || '');
      } catch (error) {
        console.error('Error fetching categories or wallets:', error);
      }
    };

    fetchData();
  }, [transaction, userToken]);

  const handleUpdateTransaction = async () => {
    try {
      await updateTransaction(
        editedTransaction.id,
        editedTransaction,
        userToken,
      );
      setIsEditing(false);
      navigation.navigate('Transactions');
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransactions(editedTransaction.id, userToken);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (!selectedDate) {
      return;
    }

    const existingDate = new Date(editedTransaction.date);
    const newDate = new Date(selectedDate);

    newDate.setHours(existingDate.getHours());
    newDate.setMinutes(existingDate.getMinutes());
    newDate.setSeconds(existingDate.getSeconds());

    setEditedTransaction({...editedTransaction, date: newDate});
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (!selectedTime) {
      return;
    }

    const existingDate = new Date(editedTransaction.date);
    const newDate = new Date(existingDate);

    newDate.setHours(selectedTime.getHours());
    newDate.setMinutes(selectedTime.getMinutes());
    newDate.setSeconds(0);

    setEditedTransaction({...editedTransaction, date: newDate});
  };

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Transaction data not found.</Text>
      </View>
    );
  }

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(transaction.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={20} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Transaction</Text>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <FontAwesome6
                name="money-bill-transfer"
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Manage your transaction</Text>
              <Text style={styles.heroSubtitle}>
                Review the details below or switch to edit mode to update them.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            {isEditing ? (
              <>
                <Text style={styles.sectionTitle}>Edit Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Type</Text>
                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemContainerStyle={styles.dropdownItemContainer}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={typeOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Type"
                    value={editedTransaction.type}
                    onChange={item =>
                      setEditedTransaction({
                        ...editedTransaction,
                        type: item.value,
                      })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    style={styles.input}
                    value={editedTransaction.notes?.toString() || ''}
                    onChangeText={text =>
                      setEditedTransaction({...editedTransaction, notes: text})
                    }
                    placeholder="Enter notes"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Amount</Text>
                  <TextInput
                    style={styles.input}
                    value={editedTransaction.amount?.toString() || ''}
                    onChangeText={text =>
                      setEditedTransaction({
                        ...editedTransaction,
                        amount: text === '' ? '' : parseFloat(text),
                      })
                    }
                    placeholder="Enter amount"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Category</Text>
                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemContainerStyle={styles.dropdownItemContainer}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={categories}
                    labelField="category_name"
                    valueField="id"
                    placeholder="Select Category"
                    value={
                      typeof editedTransaction.category === 'object'
                        ? editedTransaction.category?.id
                        : editedTransaction.category
                    }
                    onChange={item =>
                      setEditedTransaction({
                        ...editedTransaction,
                        category: item.id,
                      })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Wallet</Text>
                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemContainerStyle={styles.dropdownItemContainer}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={wallets}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Wallet"
                    value={
                      typeof editedTransaction.wallet === 'object'
                        ? editedTransaction.wallet?.id
                        : editedTransaction.wallet
                    }
                    onChange={item =>
                      setEditedTransaction({
                        ...editedTransaction,
                        wallet: item.id,
                      })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.pickerButtonText}>
                      {new Date(editedTransaction.date).toLocaleDateString(
                        'en-US',
                      )}
                    </Text>
                    <AntDesign
                      name="calendar"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(editedTransaction.date)}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Time</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.pickerButtonText}>
                      {new Date(editedTransaction.date).toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Text>
                    <AntDesign
                      name="clockcircleo"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {showTimePicker && (
                  <DateTimePicker
                    value={new Date(editedTransaction.date)}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleUpdateTransaction}>
                  <Text style={styles.primaryButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setIsEditing(false)}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Transaction Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{transaction.type}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Note</Text>
                  <Text style={styles.detailValue}>{transaction.notes}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>{transaction.amount}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formattedDate}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{formattedTime}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{categoryName}</Text>
                </View>

                <View style={[styles.detailRow, styles.lastRow]}>
                  <Text style={styles.detailLabel}>Wallet</Text>
                  <Text style={styles.detailValue}>{walletName}</Text>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => setIsEditing(true)}>
                  <Text style={styles.primaryButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteTransaction}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 120,
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
    fontWeight: '600',
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
  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
  },
  dropdownContainer: {
    borderRadius: 16,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  dropdownItemContainer: {
    backgroundColor: COLORS.card,
  },
  dropdownItemText: {
    color: COLORS.text,
    fontSize: 15,
  },
  dropdownPlaceholder: {
    color: '#94A3B8',
    fontSize: 15,
  },
  dropdownSelectedText: {
    color: COLORS.text,
    fontSize: 15,
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
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '800',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default EditTransaction;
