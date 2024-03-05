import React from 'react';
import {Text, Platform, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  HomeScreen,
  Account,
  Graph,
  Goals,
  ManageExpense,
} from '../screens/Index';

const Tab = createBottomTabNavigator();

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
    backgroundColor: 'white',
  },
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign
                  name="home"
                  size={24}
                  color={focused ? 'green' : '#111'}
                />
                <Text style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                  Home
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Graph"
        component={Graph}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign
                  name="linechart"
                  size={24}
                  color={focused ? 'green' : '#111'}
                />
                <Text style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                  Category
                </Text>
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
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
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="Goals"
        component={Goals}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign
                  name="checksquareo"
                  size={24}
                  color={focused ? 'green' : '#111'}
                />
                <Text style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                  Goals
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign
                  name="user"
                  size={24}
                  color={focused ? 'green' : '#111'}
                />
                <Text style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                  Analytics
                </Text>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
