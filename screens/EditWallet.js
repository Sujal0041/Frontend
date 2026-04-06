// EditWallet.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useAuth} from '../api/authContext';
import {getExchangeRate, updateWallet} from '../api/api';
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
};

const EditWallet = ({route}) => {
  const {wallet} = route.params;
  const [name, setName] = useState(wallet.name);
  const [type, setType] = useState(wallet.type);
  const [amount, setAmount] = useState(wallet.amount.toString());
  const [currency, setCurrency] = useState(wallet.currency);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const {userToken, currency: currencyOptions} = useAuth();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a wallet name.');
      return;
    }

    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    try {
      setLoading(true);

      const rate = await getExchangeRate(wallet.currency, currency);

      const updatedWallet = {
        ...wallet,
        name: name.trim(),
        type,
        amount: parseFloat((parseFloat(amount) * rate).toFixed(2)),
        currency,
        rate,
      };

      await updateWallet(updatedWallet.id, updatedWallet, userToken);
      Alert.alert('Success', 'Wallet updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed', error);
      Alert.alert('Error', 'Failed to update wallet');
    } finally {
      setLoading(false);
    }
  };

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

            <Text style={styles.headerTitle}>Edit Wallet</Text>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSave}
              disabled={loading}>
              <AntDesign name="check" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <FontAwesome6 name="wallet" size={20} color={COLORS.primary} />
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Update your wallet</Text>
              <Text style={styles.heroSubtitle}>
                Edit wallet details like name, type, currency, and amount.
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter wallet name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Wallet Type</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemContainerStyle={styles.dropdownItemContainer}
                itemTextStyle={styles.dropdownItemText}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                data={[
                  {label: 'Bank', value: 'Bank'},
                  {label: 'Cash', value: 'Cash'},
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select wallet type"
                value={type}
                onChange={item => setType(item.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemContainerStyle={styles.dropdownItemContainer}
                itemTextStyle={styles.dropdownItemText}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.searchInput}
                search
                searchPlaceholder="Search currency..."
                data={currencyOptions.map(curr => ({
                  label: curr,
                  value: curr,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select currency"
                dropdownPosition="top"
                value={currency}
                onChange={item => setCurrency(item.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}>
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
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
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 18,
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
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderColor: COLORS.border,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default EditWallet;
