import 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {AccountSettings, Currency, Reminder} from '../DrawerScreen/IndexPath';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {LineChart, ProgressChart} from 'react-native-chart-kit';

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Currency" component={Currency} />
      <Drawer.Screen name="AccountSettings" component={AccountSettings} />
      <Drawer.Screen name="Reminder" component={Reminder} />
    </Drawer.Navigator>
  );
};

const HomeScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.box2}>
        <View style={styles.inner2}>
          <Text style={styles.text}>Dashboard</Text>
          <LineChart
            data={{
              labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              datasets: [
                {
                  data: [20, 30, 40, 50],
                },
              ],
            }}
            width={Dimensions.get('window').width - 16}
            height={250}
            yAxisLabel={'Rs'}
            chartConfig={{
              backgroundGradientFrom: 'grey',
              backgroundGradientTo: 'grey',
              decimalPlaces: 1,
              color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{
              borderRadius: 16,
            }}
          />
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <Text style={styles.text2}>Account</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 5,
              paddingBottom: 5,
            }}>
            <Text>Cash </Text>
            <Text style={{paddingRight: 55}}>Bank</Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Rs XXXX NPR</Text>
            <Text>Rs XXXX NPR</Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <Text style={styles.text2}>Cash Flow</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>+ Income</Text>
            <Text>Rs XXXX NPR</Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>- Expense</Text>
            <Text>Rs XXXX NPR</Text>
          </View>

          <Text style={{paddingLeft: 20, marginTop: -8}}>
            ________________________________________________________
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Total</Text>
            <Text>Rs XXXX NPR</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  text2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  box: {
    width: '100%',
    height: '17%',
    padding: 5,
  },
  box2: {
    width: '100%',
    height: '57%',
    padding: 5,
  },
  inner: {
    flex: 1,
    backgroundColor: 'lightgrey',
    padding: 5,
  },
  inner2: {
    flex: 1,
    backgroundColor: 'lightgrey',
    padding: 5,
  },
});

export default MyDrawer;
