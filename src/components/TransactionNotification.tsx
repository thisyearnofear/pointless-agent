import { TransactionResult } from "@/types/chat";

interface TransactionNotificationProps {
  transaction: TransactionResult;
  onClose: () => void;
}

export function TransactionNotification({
  transaction,
  onClose,
}: TransactionNotificationProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        transaction.success ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p
            className={`font-medium ${
              transaction.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {transaction.success
              ? "Transaction Successful"
              : "Transaction Failed"}
          </p>
          {transaction.error && (
            <p className="text-sm text-red-600 mt-1">{transaction.error}</p>
          )}
          {transaction.txHash && (
            <a
              href={`https://explorer.near.org/transactions/${transaction.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 block"
            >
              View on Explorer
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
