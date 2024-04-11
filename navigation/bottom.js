import React, {useState} from 'react';
import {Text, Platform, View, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  HomeScreen,
  Transactions,
  Goals,
  ManageTransaction,
  AddGoals,
  More,
} from '../screens/Index';
import Wallets from '../screens/Wallets';
import AddWallet from '../screens/AddWallet';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    height: 60,
    backgroundColor: '#3e3e42',
  },
};

const GoalsNav = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Goals" component={Goals} />
      <Stack.Screen name="AddGoals" component={AddGoals} />
    </Stack.Navigator>
  );
};

const ManageTransactionNav = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManageTransaction"
        component={ManageTransaction}
        options={{
          headerLeft: null, // Remove the back navigation button
        }}
      />
      <Stack.Screen name="AddWalletButton" component={AddWallet} />
      <Stack.Screen
        name="Wallets"
        component={Wallets}
        options={{
          title: 'Wallets',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddWalletButton')}
              style={{marginRight: 10}}>
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({route}) => ({
            tabBarIcon: ({focused}) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign
                  name="home"
                  size={24}
                  color={focused ? '#007acc' : 'white'}
                />
                <Text
                  style={{fontSize: 12, color: focused ? '#007acc' : 'white'}}>
                  Home
                </Text>
              </View>
            ),
          })}
        />
        <Tab.Screen
          name="Transactions"
          component={Transactions}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <AntDesign
                    name="swap"
                    size={24}
                    color={focused ? '#007acc' : 'white'}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: focused ? '#007acc' : 'white',
                    }}>
                    Transactions
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="ManageTransaction"
          options={{
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#16247d',
                  width: Platform.OS == 'ios' ? 50 : 60,
                  height: Platform.OS == 'ios' ? 50 : 60,
                  top: Platform.OS == 'ios' ? -10 : -20,
                  borderRadius: Platform.OS == 'ios' ? 25 : 30,
                }}>
                <AntDesign name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}>
          {() => (
            <ManageTransaction
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Goals"
          component={GoalsNav}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <AntDesign
                    name="checksquareo"
                    size={24}
                    color={focused ? '#007acc' : 'white'}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: focused ? '#007acc' : 'white',
                    }}>
                    Goals
                  </Text>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="More"
          component={More}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <AntDesign
                    name="swap"
                    size={24}
                    color={focused ? '#007acc' : 'white'}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: focused ? '#007acc' : 'white',
                    }}>
                    More
                  </Text>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
      <ManageTransaction
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default MainTabNavigator;
