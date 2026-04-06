import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {logout} from '../api/api';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  amber: '#D97706',
  amberSoft: '#FEF3C7',
  purple: '#7C3AED',
  purpleSoft: '#EDE9FE',
};

const More = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  const menuItems = [
    {
      title: 'Profile',
      subtitle: 'Update your account settings',
      icon: 'user',
      iconBg: COLORS.primarySoft,
      iconColor: COLORS.primary,
      onPress: () => navigation.navigate('AccountSettings'),
    },

    {
      title: 'Add Wallet',
      subtitle: 'Create a new wallet account',
      icon: 'wallet',
      iconBg: COLORS.successSoft,
      iconColor: COLORS.success,
      onPress: () => navigation.navigate('AddWallet'),
    },
    {
      title: 'Budget',
      subtitle: 'Plan and control spending',
      icon: 'bank',
      iconBg: COLORS.purpleSoft,
      iconColor: COLORS.purple,
      onPress: () => navigation.navigate('Budget'),
    },
    {
      title: 'Category',
      subtitle: 'Manage your categories',
      icon: 'appstore1',
      iconBg: COLORS.primarySoft,
      iconColor: COLORS.primary,
      onPress: () => navigation.navigate('ViewCategory'),
    },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}></Text>
          </View>
        </View>

        {menuItems.map(item => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.88}
            style={styles.menuCard}
            onPress={item.onPress}>
            <View style={[styles.menuIconWrap, {backgroundColor: item.iconBg}]}>
              <AntDesign name={item.icon} size={20} color={item.iconColor} />
            </View>

            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>

            <AntDesign name="right" size={16} color={COLORS.subText} />
          </TouchableOpacity>
        ))}

        <View style={styles.dangerCard}>
          <View style={styles.dangerIconWrap}>
            <AntDesign name="logout" size={18} color={COLORS.danger} />
          </View>
          <View style={styles.dangerTextWrap}>
            <Text style={styles.dangerTitle}>Sign out of your account</Text>
            <Text style={styles.dangerSubtitle}>
              You will need to log in again to continue using the app.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dangerButton}
            onPress={handleLogout}>
            <Text style={styles.dangerButtonText}>Sign Out</Text>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.subText,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  signOutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '800',
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
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.subText,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  menuIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  menuSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.subText,
  },
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  dangerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dangerTextWrap: {
    marginBottom: 14,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  dangerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.subText,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default More;
