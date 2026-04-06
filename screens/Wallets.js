import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import {getAllWallets} from '../api/api';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useAuth} from '../api/authContext';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
};

const Wallets = ({handleWalletSelection, setShowWallets}) => {
  const navigation = useNavigation();
  const [wallets, setWallets] = useState([]);
  const {userToken} = useAuth();

  useEffect(() => {
    fetchWallets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchWallets();
    }, []),
  );

  const fetchWallets = async () => {
    try {
      const walletsData = await getAllWallets(userToken);
      setWallets(walletsData || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWallets([]);
    }
  };

  const handleWalletPress = wallet => {
    handleWalletSelection(wallet);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowWallets(false)}>
          <AntDesign name="arrowleft" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Wallets</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <FontAwesome6 name="wallet" size={20} color={COLORS.primary} />
          </View>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Choose a wallet</Text>
            <Text style={styles.heroSubtitle}>
              Select the wallet you want to use for this transaction or action.
            </Text>
          </View>
        </View>

        {wallets.length > 0 ? (
          wallets.map(wallet => (
            <TouchableOpacity
              key={wallet.id}
              activeOpacity={0.88}
              style={styles.walletCard}
              onPress={() => handleWalletPress(wallet)}>
              <View style={styles.walletLeft}>
                <View style={styles.walletIconWrap}>
                  <FontAwesome6
                    name="wallet"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.walletTextWrap}>
                  <Text style={styles.walletName} numberOfLines={1}>
                    {wallet.name}
                  </Text>
                  <Text style={styles.walletSubtitle}>Available wallet</Text>
                </View>
              </View>

              <View style={styles.arrowWrap}>
                <AntDesign name="right" size={16} color={COLORS.subText} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <AntDesign name="inbox" size={28} color={COLORS.subText} />
            <Text style={styles.emptyTitle}>No wallets found</Text>
            <Text style={styles.emptySubtitle}>
              Add a wallet first to start managing your money more easily.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 40,
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
  walletCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  walletName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  walletSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.subText,
  },
  arrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
    textAlign: 'center',
  },
});

export default Wallets;
