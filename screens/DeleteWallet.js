import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useAuth} from '../api/authContext';
import {deleteWallet} from '../api/api';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
};

const DeleteWallet = ({route}) => {
  const {wallet} = route.params;
  const navigation = useNavigation();
  const {userToken} = useAuth();

  const handleDeleteWallet = async () => {
    try {
      await deleteWallet(wallet.id, userToken);
      Alert.alert('Success', 'Wallet deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete wallet');
    }
  };

  const handleEditWallet = () => {
    navigation.navigate('EditWallet', {wallet});
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

          <Text style={styles.headerTitle}>Wallet Details</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <FontAwesome6 name="wallet" size={18} color={COLORS.primary} />
          </View>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Manage your wallet</Text>
            <Text style={styles.heroSubtitle}>
              Review the wallet details below, update them, or delete the wallet
              if you no longer need it.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wallet Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{wallet.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{wallet.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{wallet.amount}</Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <Text style={styles.detailLabel}>Currency</Text>
            <Text style={styles.detailValue}>{wallet.currency}</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEditWallet}>
            <Text style={styles.primaryButtonText}>Update Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteWallet}>
            <Text style={styles.deleteButtonText}>Delete Wallet</Text>
          </TouchableOpacity>
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
  primaryButton: {
    backgroundColor: COLORS.success,
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
  deleteButton: {
    backgroundColor: COLORS.dangerSoft,
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
});

export default DeleteWallet;
