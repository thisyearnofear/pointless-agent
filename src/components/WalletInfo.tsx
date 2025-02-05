interface WalletInfoProps {
  open: boolean;
  onClose: () => void;
}

export function WalletInfo({ open, onClose }: WalletInfoProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">About Bitte Wallet</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Bitte Wallet is a secure, easy-to-use wallet for the NEAR
              ecosystem. It allows you to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Store and manage your NEAR tokens</li>
              <li>Interact with decentralized applications (dApps)</li>
              <li>Execute smart contract transactions</li>
              <li>Access both NEAR and EVM functionality</li>
            </ul>
            <p>
              When you connect your wallet, you'll be able to interact with our
              AI agents and execute transactions they suggest.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <h3 className="text-blue-800 font-medium mb-2">New to NEAR?</h3>
              <p className="text-blue-600 text-sm">
                If you don't have a NEAR wallet yet, one will be created for you
                during the connection process. Your wallet is your gateway to
                the NEAR ecosystem!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
