import React, {useState} from 'react';
import {Text, Platform, View, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createStackNavigator} from '@react-navigation/stack';

import {
  HomeScreen,
  Transactions,
  Goals,
  ManageTransaction,
  AddGoals,
  More,
  DeleteTransaction,
  DeleteWallet,
  EditWallet,
} from '../screens/index';
import Wallets from '../screens/Wallets';
import AddWallet from '../screens/AddWallet';

import AccountSettings from '../MoreScreen/AccountSettings';
import Budget from '../MoreScreen/Budget';
import BudgetDetail from '../MoreScreen/BudgetDetail';
import ViewCategory from '../MoreScreen/ViewCategory';
import AddCategory from '../MoreScreen/AddCategory';
import CategoryIcon from '../MoreScreen/CategoryIcon';
import ViewReminder from '../MoreScreen/ViewReminder';
import AddReminder from '../MoreScreen/AddReminder';
import GoalDetail from '../MoreScreen/GoalDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ACTIVE_COLOR = '#2563EB';
const INACTIVE_COLOR = '#94A3B8';
const TAB_BG = '#FFFFFF';
const FAB_BG = '#2563EB';
const LABEL_COLOR = '#0F172A';

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    height: 72,
    borderRadius: 24,
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
};

const TabItem = ({focused, icon, label}) => {
  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <AntDesign name={icon} size={22} color={color} />
      </View>
      <Text
        style={[styles.tabLabel, {color}, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
};

const GoalsNav = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Goals" component={Goals} />
    <Stack.Screen name="AddGoals" component={AddGoals} />
    <Stack.Screen name="GoalDetail" component={GoalDetail} />
  </Stack.Navigator>
);

const DelTransaction = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Transactions" component={Transactions} />
    <Stack.Screen name="DeleteTransaction" component={DeleteTransaction} />
  </Stack.Navigator>
);

const DelWallet = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="DeleteWallet" component={DeleteWallet} />
    <Stack.Screen name="EditWallet" component={EditWallet} />
  </Stack.Navigator>
);

const MoreNav = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="More" component={More} />
    <Stack.Screen name="AccountSettings" component={AccountSettings} />
    <Stack.Screen name="Budget" component={Budget} />
    <Stack.Screen name="BudgetDetail" component={BudgetDetail} />
    <Stack.Screen name="AddWallet" component={AddWallet} />
    <Stack.Screen name="ViewCategory" component={ViewCategory} />
    <Stack.Screen name="AddCategory" component={AddCategory} />
    <Stack.Screen name="CategoryIcon" component={CategoryIcon} />
    <Stack.Screen name="ViewReminder" component={ViewReminder} />
    <Stack.Screen name="AddReminder" component={AddReminder} />
  </Stack.Navigator>
);

const ManageTransactionNav = ({modalVisible, setModalVisible}) => {
  return (
    <ManageTransaction
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    />
  );
};

const MainTabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: '#F8FAFC'}}>
      <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={DelWallet}
          options={{
            tabBarIcon: ({focused}) => (
              <TabItem focused={focused} icon="home" label="Home" />
            ),
          }}
        />

        <Tab.Screen
          name="TransactionTab"
          component={DelTransaction}
          options={{
            tabBarIcon: ({focused}) => (
              <TabItem focused={focused} icon="swap" label="Transactions" />
            ),
          }}
        />

        <Tab.Screen
          name="ManageTransaction"
          options={{
            tabBarIcon: () => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setModalVisible(true)}
                style={styles.fabButton}>
                <AntDesign name="plus" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            ),
          }}>
          {() => (
            <ManageTransactionNav
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Goals"
          component={GoalsNav}
          options={{
            tabBarIcon: ({focused}) => (
              <TabItem focused={focused} icon="checksquareo" label="Goals" />
            ),
          }}
        />

        <Tab.Screen
          name="More"
          component={MoreNav}
          options={{
            tabBarIcon: ({focused}) => (
              <TabItem focused={focused} icon="ellipsis1" label="More" />
            ),
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

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#EFF6FF',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: LABEL_COLOR,
    fontWeight: '700',
  },
  fabButton: {
    width: Platform.OS === 'ios' ? 58 : 62,
    height: Platform.OS === 'ios' ? 58 : 62,
    borderRadius: Platform.OS === 'ios' ? 29 : 31,
    backgroundColor: FAB_BG,
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? -14 : -20,
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default MainTabNavigator;
