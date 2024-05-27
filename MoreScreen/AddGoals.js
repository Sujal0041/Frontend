import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Wallets from '../screens/Wallets';
import {Dropdown} from 'react-native-element-dropdown';
import {addGoal, getAllCategories} from '../api/api';
import {useAuth} from '../api/authContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AddGoal = ({modalVisible, setModalVisible, fetchGoals}) => {
  const [amount, setAmount] = useState('');
  const [BName, setBName] = useState('');
  const [showWallets, setShowWallets] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const {userToken} = useAuth();

  const handleEndDateChange = (event, selectedDate) => {
    setEndDate(selectedDate);
    setShowEndDatePicker(false);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setStartDate(selectedDate);
    setShowStartDatePicker(false);
  };

  const handleAddGoal = async () => {
    try {
      await addGoal(
        {
          amount: parseFloat(amount),
          name: BName,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'ongoing',
        },
        userToken,
      );
      setAmount('');
      setBName('');
      setStartDate(new Date());
      setEndDate(new Date());
      setModalVisible(false);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      {/* <View style={styles.container}> */}
      {showWallets ? (
        <Wallets
          handleWalletSelection={handleWalletSelection}
          setShowWallets={setShowWallets}
        />
      ) : (
        <View style={styles.modalContainer}>
          <View style>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Goal</Text>
          </View>

          <View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputAmount}
                placeholder="0"
                placeholderTextColor={'white'}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <View>
              <TextInput
                style={[styles.input, {color: 'white'}]}
                placeholder="Goal Name"
                placeholderTextColor="#8c8c8e"
                value={BName}
                onChangeText={setBName}
              />
            </View>

            {/* <TouchableOpacity
              style={[
                styles.walletButton,
                {
                  backgroundColor: '#333136',
                  borderRadius: 10,
                  marginTop: 10,
                },
              ]}
              onPress={() => setShowWallets(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.accountText,
                    {color: 'white', fontWeight: 'bold', textAlign: 'left'},
                  ]}>
                  Account
                </Text>
                <Text
                  style={[
                    styles.walletButtonText,
                    {
                      color: '#8c8c8e',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    },
                  ]}>
                  {wallet.name || 'Select Wallet'}
                </Text>
              </View>
            </TouchableOpacity> */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Start Date</Text>

              {showStartDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                  onCancel={() => setShowStartDatePicker(false)}
                />
              )}
              <Text style={styles.datePickerText}>
                {startDate.toLocaleDateString('en-US')}
                {'  '}
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowStartDatePicker(true)}>
                <AntDesign name="calendar" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>End Date</Text>

              {showEndDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  onCancel={() => setShowEndDatePicker(false)}
                />
              )}
              <Text style={styles.datePickerText}>
                {endDate.toLocaleDateString('en-US')}
                {'  '}
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowEndDatePicker(true)}>
                <AntDesign name="calendar" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.addButton, {backgroundColor: '#8c8c8e'}]}
              onPress={handleAddGoal}>
              <Text
                style={[
                  styles.addButtonText,
                  {color: 'white', fontFamily: 'roboto'}, // Text color and font family
                ]}>
                Add
              </Text>
            </TouchableOpacity>

            {!isFormValid && (
              <View style={styles.warningModal}>
                <Text style={styles.warningText}>
                  Please fill all the details.
                </Text>
                <TouchableOpacity
                  onPress={() => setIsFormValid(true)}
                  style={styles.dismissButton}>
                  <Text style={styles.dismissButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      {/* </View> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  walletButton: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    width: 80,
    height: 45,
  },
  cancelButtonText: {
    color: '#277ad0',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  inputAmount: {
    flex: 1,
    fontSize: 20,
    color: 'white', // Default text color
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
    flex: 1,
  },
  dateInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignItems: 'flex-start',
  },
  datePickerText: {
    fontSize: 16,
    color: 'white', // Color of the chosen date
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'roboto',
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
  },
  dropdown: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 50,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddGoal;
