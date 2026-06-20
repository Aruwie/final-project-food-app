import { fetchAPI } from "./api";

export async function getMyTransactions() {
  return fetchAPI("/my-transactions");
}

export async function getTransactionById(transactionId) {
  return fetchAPI(`/transaction/${transactionId}`);
}

export async function createTransaction(cartIds, paymentMethodId) {
  return fetchAPI("/create-transaction", {
    method: "POST",
    body: JSON.stringify({ cartIds, paymentMethodId }),
  });
}

export async function cancelTransaction(transactionId) {
  return fetchAPI(`/cancel-transaction/${transactionId}`, {
    method: "POST",
  });
}

export async function updateTransactionProofPayment(transactionId, proofPaymentUrl) {
  return fetchAPI(`/update-transaction-proof-payment/${transactionId}`, {
    method: "POST",
    body: JSON.stringify({ proofPaymentUrl }),
  });
}

export async function updateTransactionStatus(transactionId, status) {
  return fetchAPI(`/update-transaction-status/${transactionId}`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
}

/**
 * ADMIN ONLY
 * Get all transactions for admin dashboard
 */
export async function getAllTransactions() {
  const res = await fetchAPI("/all-transactions");

  // fallback kalau endpoint berbeda di backend
  if (res?.status === 404 || res?.status === 401) {
    return fetchAPI("/transactions");
  }

  return res;
}