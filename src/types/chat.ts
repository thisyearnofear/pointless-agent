export interface TransactionResult {
  success: boolean;
  error?: string;
  txHash?: string;
}

export interface ChatState {
  messages: Array<{
    role: string;
    content: string;
  }>;
  context?: Record<string, unknown>;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
}

export interface EvmTransaction {
  chainId: number;
  to: string;
  value: bigint;
  data?: string;
}

export const AVAILABLE_AGENTS: AgentConfig[] = [
  {
    id: "agent-pointless",
    name: "Agent Pointless",
    description:
      "Your versatile assistant with built-in tools for blockchain, social media, and fun interactions",
    category: "General",
    image: "/images/agent-pointless.png",
  },
  {
    id: "coingecko-ai.vercel.app",
    name: "CoinGecko Agent",
    description:
      "Provides real-time cryptocurrency data and market information",
    category: "Investing",
  },
  {
    id: "technical-analysis-agent.vercel.app",
    name: "Crypto Technical Analyst",
    description: "Provides in-depth market analysis and trading insights",
    category: "Investing",
  },
  {
    id: "near-uniswap-agent.vercel.app",
    name: "Uniswap Assistant",
    description: "Generates transaction data for Uniswap V3 Interactions",
    category: "DeFi",
  },
  {
    id: "dcaagent.deltatrade.ai",
    name: "Delta Trade DCA Helper",
    description: "Helps set up DCA plans to buy NEAR and other tokens",
    category: "Investing",
  },
];
