import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {addWallet} from '../api/api';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../api/authContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  success: '#16A34A',
};

const AddWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState(null);
  const [currency, setCurrency] = useState(null);

  const navigation = useNavigation();
  const {userToken, currency: currencyOptions} = useAuth();

  const handleSave = async () => {
    if (!walletName || !amount || !walletType) {
      Alert.alert('Missing fields', 'Please fill all required fields');
      return;
    }

    const walletData = {
      name: walletName,
      amount: parseFloat(amount),
      type: walletType,
      currency: currency || 'NPR',
    };

    try {
      await addWallet(walletData, userToken);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding wallet:', error);
      Alert.alert('Error', 'Failed to add wallet');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Wallet</Text>

          <View style={{width: 42}} />
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AntDesign name="wallet" size={22} color={COLORS.primary} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.heroTitle}>Create a Wallet</Text>
            <Text style={styles.heroSubtitle}>
              Add a wallet to track your balance and transactions.
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wallet Details</Text>

          <Text style={styles.label}>Wallet Name</Text>
          <TextInput
            style={styles.input}
            value={walletName}
            onChangeText={setWalletName}
            placeholder="e.g. Cash, Bank Account"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={[
              {label: 'Bank', value: 'Bank'},
              {label: 'Cash', value: 'Cash'},
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select wallet type"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            value={walletType}
            onChange={item => setWalletType(item.value)}
          />

          <Text style={styles.label}>Currency</Text>
          <Dropdown
            style={styles.dropdown}
            search
            searchPlaceholder="Search..."
            data={currencyOptions.map(curr => ({
              label: curr,
              value: curr,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Select currency"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            value={currency}
            onChange={item => setCurrency(item.value)}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.9}
          onPress={handleSave}>
          <Text style={styles.addButtonText}>Add Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
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
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.subText,
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: COLORS.text,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.subText,
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    color: COLORS.text,
  },

  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 4,
  },

  placeholder: {
    color: '#94A3B8',
  },
  selectedText: {
    color: COLORS.text,
    fontWeight: '700',
  },

  addButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default AddWallet;
