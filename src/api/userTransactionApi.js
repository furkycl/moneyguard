import axios from "axios";

// Minimal: relative in dev (uses Vite proxy), absolute in prod
const BASE_URL = import.meta.env.DEV ? "/" : "https://wallet.b.goit.study/";

export const userTransactionApi = axios.create({
  baseURL: BASE_URL,
});

// Set Token
export const setToken = (token) => {
  if (token) {
    userTransactionApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
    delete userTransactionApi.defaults.headers.common["Authorization"];
  }
};

export const removeToken = () => {
  delete userTransactionApi.defaults.headers.common["Authorization"];
};

// --- Transactions --- //

// Fetch all transactions
export const fetchAllTransactions = async (token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.get("api/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response || error);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transactionData, token) => {
  if (token) setToken(token);

  const payload = {
    transactionDate: transactionData.transactionDate, // ISO string
    type: transactionData.type, // "INCOME" or "EXPENSE"
    categoryId: transactionData.categoryId,
    comment: transactionData.comment || "",
    amount: Number(transactionData.amount),
  };

  try {
    const response = await userTransactionApi.post("api/transactions", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response?.data || error);
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (transactionData, token) => {
  if (token) setToken(token);

  const { id: transactionId, ...updatePayload } = transactionData;

  const payload = {
    ...updatePayload,
    amount: Number(updatePayload.amount),
  };

  try {
    const response = await userTransactionApi.patch(
      `api/transactions/${transactionId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error.response?.data || error);
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (transactionId, token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.delete(
      `api/transactions/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error.response || error);
    throw error;
  }
};

// Fetch categories
export const fetchCategories = async (token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.get("api/transaction-categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response || error);
    throw error;
  }
};
