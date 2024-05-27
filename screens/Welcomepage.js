import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#7B70F9'}}>
      <View
        style={{flex: 1, justifyContent: 'space-around', marginVertical: 4}}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'white',
            marginTop: 100,
          }}>
          Let's Get Started!
        </Text>
        <View>
          <Image
            source={require('../images/android-chrome-512x512.png')}
            style={{
              width: 150,
              height: 150,
              marginLeft: 125,
            }}
          />
        </View>
        <View>
          <Image
            source={require('../images/resources.png')}
            style={{
              width: 150,
              height: 150,
              marginLeft: 125,
              marginBottom: 70,
            }}
          />
        </View>

        <View style={{marginVertical: 16}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              paddingVertical: 12,
              backgroundColor: '#FFD700',
              marginHorizontal: 14,
              borderRadius: 12,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#707070',
              }}>
              Register
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 12,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{fontWeight: 'bold', color: '#FFD700', marginLeft: 4}}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
