// App.js

import React from 'react';
import { View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const App = () => {
  return (
    <View marginBottom={10}>
      <RegisterScreen />
      <LoginScreen />      
    </View>
  );
};

export default App;
