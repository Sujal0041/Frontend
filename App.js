// App.js

import React from 'react';
import {View} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Welcomepage from './screens/Welcomepage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Welcome" component={Welcomepage} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerLeft: null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
