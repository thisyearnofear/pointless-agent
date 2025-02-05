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
          <h2 className="text-xl font-semibold mb-4">About Agent Pointless</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Agent Pointless is your versatile AI assistant with a range of
              built-in tools and capabilities:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Blockchain Info:</span> Get
                real-time information about NEAR blockchain transactions and
                accounts
              </li>
              <li>
                <span className="font-medium">Transaction Generation:</span>{" "}
                Create and execute NEAR transactions seamlessly
              </li>
              <li>
                <span className="font-medium">Reddit Integration:</span> Fetch
                and analyze trending content from Reddit&apos;s frontpage
              </li>
              <li>
                <span className="font-medium">Twitter Sharing:</span> Generate
                Twitter share links for easy content distribution
              </li>
              <li>
                <span className="font-medium">Fun Features:</span> Try the coin
                flip functionality for quick decision making!
              </li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <h3 className="text-blue-800 font-medium mb-2">
                Getting Started
              </h3>
              <p className="text-blue-600 text-sm">
                Connect your NEAR wallet to start interacting with Agent
                Pointless. You can ask questions, request information, or use
                any of the built-in tools through natural conversation.
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
