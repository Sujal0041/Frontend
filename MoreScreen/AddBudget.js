import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Wallets from '../screens/Wallets';
import {Dropdown} from 'react-native-element-dropdown';
import {addBudget, getAllCategories} from '../api/api';
import {useAuth} from '../api/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
};

const AddBudget = ({modalVisible, setModalVisible, fetchBudgets}) => {
  const [amount, setAmount] = useState('');
  const [BName, setBName] = useState('');
  const [category, setCategory] = useState('');
  const [wallet, setWallet] = useState('');
  const [showWallets, setShowWallets] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const {userToken} = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories(userToken);
      setAllCategories(data);
    };
    fetchCategories();
  }, []);

  const handleAddBudget = async () => {
    try {
      await addBudget(
        {
          amount: parseFloat(amount),
          name: BName,
          category,
          wallet: wallet.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        userToken,
      );

      setModalVisible(false);
      fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {showWallets ? (
        <Wallets
          handleWalletSelection={w => {
            setWallet(w);
            setShowWallets(false);
          }}
          setShowWallets={setShowWallets}
        />
      ) : (
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Add Budget</Text>
              <View style={{width: 60}} />
            </View>

            {/* Hero */}
            <View style={styles.heroCard}>
              <AntDesign name="barschart" size={22} color={COLORS.primary} />
              <Text style={styles.heroTitle}>Create a Budget</Text>
              <Text style={styles.heroSubtitle}>
                Set spending limits and track progress easily.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.card}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Budget Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Food Budget"
                value={BName}
                onChangeText={setBName}
              />

              <Text style={styles.label}>Category</Text>
              <Dropdown
                style={styles.dropdown}
                data={allCategories.map(c => ({
                  label: c.category_name,
                  value: c.id,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={category}
                onChange={item => setCategory(item.value)}
              />

              <Text style={styles.label}>Wallet</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowWallets(true)}>
                <Text style={styles.selectorText}>
                  {wallet?.name || 'Select Wallet'}
                </Text>
              </TouchableOpacity>

              {/* Dates */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.dateLabel}>Start</Text>
                  <Text style={styles.dateValue}>
                    {startDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.dateLabel}>End</Text>
                  <Text style={styles.dateValue}>
                    {endDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddBudget}>
              <Text style={styles.buttonText}>Add Budget</Text>
            </TouchableOpacity>
          </ScrollView>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(e, d) => {
                setStartDate(d || startDate);
                setShowStartDatePicker(false);
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(e, d) => {
                setEndDate(d || endDate);
                setShowEndDatePicker(false);
              }}
            />
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.bg},
  content: {padding: 16, paddingBottom: 60},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancel: {color: COLORS.primary, fontWeight: '700'},
  title: {fontSize: 20, fontWeight: '800', color: COLORS.text},

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: {fontSize: 18, fontWeight: '800', marginTop: 8},
  heroSubtitle: {color: COLORS.subText, marginTop: 4},

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    color: COLORS.subText,
    fontWeight: '600',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },

  selector: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  selectorText: {color: COLORS.text},

  row: {flexDirection: 'row', gap: 10, marginTop: 10},
  dateBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateLabel: {fontSize: 12, color: COLORS.subText},
  dateValue: {fontSize: 14, fontWeight: '700', color: COLORS.text},

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '800'},
});

export default AddBudget;
