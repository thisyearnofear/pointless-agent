"use client";

import { AVAILABLE_AGENTS } from "@/types/chat";
import { useState } from "react";

interface SidebarProps {
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function Sidebar({ selectedAgentId, onSelectAgent }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:hidden z-20 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:transform-none md:shadow-none md:w-auto ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full overflow-y-auto p-4 space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Available Agents</h2>
            <div className="space-y-2">
              {AVAILABLE_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedAgentId === agent.id
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {agent.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Category: {agent.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Resources</h2>
            <div className="space-y-2">
              <a
                href="https://pointless.wtf"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 hover:bg-gray-50 rounded transition-colors"
              >
                📚 Pointless.wtf
              </a>
              <a
                href="https://github.com/thisyearnofear/agentpointless"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 hover:bg-gray-50 rounded transition-colors"
              >
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
