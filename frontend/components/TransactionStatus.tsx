// TransactionStatus.tsx
import { useTransactionStatusQuery } from "@/hooks/useTransactionStatusQuery";
import { useState, useEffect } from "react";

export const TransactionStatus = ({ txHash }: { txHash: string }) => {
  const { data, loading, error } = useTransactionStatusQuery(txHash);

  if (loading) return <div>Loading transaction status...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (data) {
    const transaction = data.transactionStatus;
    // Handle the transaction status based on the response data
    if (transaction.__typename === "NotIndexedYetStatus") {
      return <div>Transaction not indexed yet: {transaction.reason}</div>;
    }

    if (transaction.__typename === "PendingTransactionStatus") {
      return (
        <div>
          Transaction pending, block timestamp: {transaction.blockTimestamp}
        </div>
      );
    }

    if (transaction.__typename === "FinishedTransactionStatus") {
      return (
        <div>
          Transaction finished, block timestamp: {transaction.blockTimestamp}
        </div>
      );
    }

    if (transaction.__typename === "FailedTransactionStatus") {
      return (
        <div>
          Transaction failed: {transaction.reason}, block timestamp:{" "}
          {transaction.blockTimestamp}
        </div>
      );
    }
  }

  return null;
};
