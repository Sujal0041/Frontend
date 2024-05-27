import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//   baseURL: ' http://192.168.1.65:8000/',
// });

export const BASE_URL = 'http://192.168.1.101:8000/';

const storeToken = async token => {
  try {
    console.log('Token stored', token);
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token retrieved', token);
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
    await clearToken();
    removeAuthorizationHeader();
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const addWallet = async (walletData, userToken) => {
  try {
    console.log(walletData);
    const response = await axios.post(
      `${BASE_URL}api/wallet/add/`,
      walletData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
};

// Function to fetch all wallets
export const getAllWallets = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/wallets/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw error;
  }
};

// Function to add a new transaction
export const addTransaction = async (transactionData, userToken) => {
  try {
    console.log(transactionData);
    const response = await axios.post(
      `${BASE_URL}api/transaction/add/`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Function to fetch all transactions
export const getAllTransactions = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/transactions/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Function to fetch budget list and create a new budget
export const addBudget = async (budgetData, userToken) => {
  try {
    console.log('budgetData', budgetData);
    console.log('userToken', userToken);

    const response = await axios.post(`${BASE_URL}api/budget/`, budgetData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    console.error('Error fetching budget list or creating a budget:', error);
    throw error;
  }
};

export const addGoal = async (goalData, userToken) => {
  try {
    console.log('goalData', goalData);
    const response = await axios.post(`${BASE_URL}api/goal/`, goalData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding goal:', error);
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

export const getGoalList = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/goal-list/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching goal list:', error);
    throw error;
  }
};

// Function to fetch all categories
export const getAllCategories = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/category/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Function to create a new category
export const addCategory = async (categoryData, userToken) => {
  try {
    console.log(categoryData);
    const response = await axios.post(
      `${BASE_URL}api/category/create/`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating a category:', error);
    throw error;
  }
};

// Function to calculate total divided by budget amount
export const getTotalDividedByBudgetAmount = async (
  userToken,
  walletId,
  categoryId,
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/budget/${walletId}/category/${categoryId}/total-divided-by-budget-amount/`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calculating total divided by budget amount:', error);
    throw error;
  }
};

export const getGoalProgress = async (userToken, goalId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/goal/${goalId}/progress/`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calculating total divided by budget amount:', error);
    throw error;
  }
};

export const getGoalCategory = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/category/combined`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    console.log('getGoalCategory', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calculating total divided by budget amount:', error);
    throw error;
  }
};

export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const userToken = await retrieveToken();
    const response = await axios.patch(
      `${BASE_URL}api/transaction/${transactionId}/`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransactions = async (transactionId, userToken) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}api/transaction/${transactionId}/`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const deleteWallet = async (walletId, userToken) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}api/wallet/delete/${walletId}/`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
};

export const getCurrency = async () => {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
    );
    const currencyCodes = Object.keys(response.data.rates);
    console.log('CODES', currencyCodes);

    return currencyCodes;
  } catch (error) {
    console.error('Error fetching currency:', error);
    throw error;
  }
};

export const getExchangeRate = async (currency, toCurrency) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${currency}`,
    );
    const data = await response.json();
    if (data && data.rates && data.rates[toCurrency]) {
      console.log(data.rates[toCurrency]);
      return data.rates[toCurrency];
    } else {
      throw new Error('Exchange rate not found');
    }
  } catch (error) {
    console.error('Error fetching currency:', error);
    throw error;
  }
};

export const updatePassword = async (userToken, passwordData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}api/update_password/`,
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw 'Error updating password';
  }
};

export const getCategory = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/categories/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw 'Error getting categories';
  }
};

export const getCustomCategory = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/category/custom/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting custom category:', error);
    throw 'Error getting custom category';
  }
};

export const getGoalCategoryRemoved = async userToken => {
  try {
    const response = await axios.get(`${BASE_URL}api/category/goal/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting custom category:', error);
    throw 'Error getting custom category';
  }
};

export const updateWallet = async (id, walletData, userToken) => {
  try {
    console.log('Walleeeee', walletData);
    const response = await axios.patch(
      `${BASE_URL}api/wallets/${id}/update/`,
      walletData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw 'Error updating wallet';
  }
};
