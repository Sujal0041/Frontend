import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2F5BFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.topRow}>
            <View style={styles.dotsRow}>
              {/* <View style={styles.activeDot} />
              <View style={styles.inactiveDot} />
              <View style={styles.inactiveDot} /> */}
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Start your journey the easy way</Text>
            <Text style={styles.subtitle}>
              Create your account and explore everything with a clean, simple,
              and modern experience.
            </Text>
          </View>

          <View style={styles.illustrationArea}>
            <View style={styles.platformShadow} />
            <View style={styles.platformBottom} />
            <View style={styles.platformMiddle} />
            <View style={styles.platformTop} />
            <View style={styles.floatingCard} />
            <View style={styles.sideBlockLeft} />
            <View style={styles.sideBlockRight} />
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.homeIndicator} /> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F5BFF',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 26,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  inactiveDot: {
    width: 4,
    height: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginRight: 6,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  illustrationArea: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  platformShadow: {
    position: 'absolute',
    bottom: 18,
    width: 220,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'rgba(22, 49, 161, 0.35)',
  },
  platformBottom: {
    position: 'absolute',
    bottom: 40,
    width: 180,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#7DB7FF',
  },
  platformMiddle: {
    position: 'absolute',
    bottom: 68,
    width: 150,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#2450E6',
  },
  platformTop: {
    position: 'absolute',
    bottom: 110,
    width: 120,
    height: 34,
    borderRadius: 18,
    backgroundColor: '#DDE7FF',
    borderWidth: 2,
    borderColor: '#C9D8FF',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 128,
    width: 72,
    height: 110,
    borderRadius: 14,
    backgroundColor: '#F7A629',
    transform: [{rotate: '-35deg'}],
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 5},
    elevation: 8,
  },
  sideBlockLeft: {
    position: 'absolute',
    left: 70,
    bottom: 56,
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#8FCCFF',
  },
  sideBlockRight: {
    position: 'absolute',
    right: 70,
    bottom: 62,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#5E78FF',
  },
  bottomSection: {
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: '#F2F4F8',
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2F5BFF',
  },
  loginText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    marginTop: 22,
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 110,
    height: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
});
