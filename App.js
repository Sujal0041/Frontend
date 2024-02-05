import React from 'react';
import {Text, Platform, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Welcomepage from './screens/Welcomepage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  HomeScreen,
  Account,
  Graph,
  Goals,
  ManageExpense,
  Index,
} from './screens/Index';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
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
// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Welcome"
//         screenOptions={{headerShown: false}}>
//         Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Welcome" component={Welcomepage} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="MainTab" component={MainTabNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

const MainTabNavigator = () => {
  return (
    <NavigationContainer>
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
                  <Text
                    style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
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
                  <Text
                    style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                    Graph
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
                  <Text
                    style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
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
                  <Text
                    style={{fontSize: 12, color: focused ? 'green' : '#111'}}>
                    Profile
                  </Text>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;
