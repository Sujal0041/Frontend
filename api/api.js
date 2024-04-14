import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//   baseURL: ' http://192.168.1.65:8000/',
// });

export const BASE_URL = 'http://192.168.1.111:8000/';

const storeToken = async token => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// api.interceptors.request.use(
//   async config => {
//     const token = await retrieveToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

export {storeToken, retrieveToken};
// export default api;

const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Function to remove authorization headers from Axios
const removeAuthorizationHeader = () => {
  axios.defaults.headers.common['Authorization'] = null;
};

// Logout function
export const logout = async () => {
  try {
    await clearToken(); // Clear the stored token
    removeAuthorizationHeader(); // Remove authorization headers from Axios
    console.log('Logout successful');
    // You may want to navigate to the login screen or perform any other action after logout
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const addWallet = async walletData => {
  try {
    console.log(walletData);
    const response = await axios.post(`${BASE_URL}api/wallet/add/`, walletData);
    return response.data;
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
};

// Function to fetch all wallets
export const getAllWallets = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/wallets/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw error;
  }
};

// Function to add a new transaction
export const addTransaction = async transactionData => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/transaction/add/`,
      transactionData,
    );
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Function to fetch all transactions
export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/transactions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Function to fetch budget list and create a new budget
export const addBudget = async budgetData => {
  try {
    console.log('budgetData', budgetData);
    const response = await axios.post(`${BASE_URL}api/budget/`, budgetData);
    return response.data;
  } catch (error) {
    console.error('Error fetching budget list or creating a budget:', error);
    throw error;
  }
};

// Function to fetch a budget detail by pk
export const getBudgetDetail = async pk => {
  try {
    const response = await axios.get(`${BASE_URL}api/budget/${pk}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budget detail:', error);
    throw error;
  }
};

// Function to fetch budget list
export const getBudgetList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/budget-list/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budget list:', error);
    throw error;
  }
};
