import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';

const Currency = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [currencyCodes, setCurrencyCodes] = useState([]);

  useEffect(() => {
    fetchCurrencyCodes();
  }, []);

  const fetchCurrencyCodes = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v2/all');
      const countries = response.data;
      const uniqueCodesSet = new Set();
      countries.forEach(country => {
        if (country.currencies) {
          country.currencies.forEach(currency => {
            uniqueCodesSet.add(currency.code);
          });
        }
      });
      const uniqueCodes = Array.from(uniqueCodesSet);
      setCurrencyCodes(uniqueCodes);
    } catch (error) {
      console.error('Error fetching currency codes:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{color: 'white', fontSize: 20, marginLeft: 2}}>
          Base Currency
        </Text>
      </View>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'white'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={currencyCodes.map(code => ({label: code, value: code}))}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Currency' : '...'}
        searchPlaceholder="Search Currency"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 9,
    flex: 1,
    justifyContent: 'top',
    alignContent: 'top',
  },
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 7,
    paddingHorizontal: 8,
    color: 'white',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'white',
  },
});
