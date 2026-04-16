import { startTransition, useState } from "react";
import type {
  ChatWithAgentHook,
  ConversationMessage,
  WeatherResultsType,
} from "@/lib/types";
import { agentApi } from "@/lib/config/agentRequest";

export const useChatWithAgent = (): ChatWithAgentHook => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [results, setResults] = useState<WeatherResultsType>({
    status: "initial",
    conversation: [],
  });

  const getInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setUserMessage(value);
  };

  const sendMessage = async () => {
    const nextMessage = userMessage.trim();

    if (!nextMessage) {
      return;
    }

    const priorConversation = results.conversation ?? [];
    const nextConversation: ConversationMessage[] = [
      ...priorConversation,
      { role: "user", content: nextMessage },
    ];

    setResults({
      status: "pending",
      conversation: nextConversation,
    });
    setUserMessage("");

    let streamedMessage = "";
    const response = await agentApi.sendConversation(
      nextConversation,
      (message) => {
        streamedMessage = message;
        startTransition(() => {
          setResults({
            status: "pending",
            conversation: [
              ...nextConversation,
              { role: "assistant", content: message },
            ],
          });
        });
      },
    );

    if (!response.ok) {
      setResults({
        status: "failed",
        error: response.error,
        conversation: streamedMessage
          ? [
              ...nextConversation,
              { role: "assistant", content: streamedMessage },
            ]
          : nextConversation,
      });
      return;
    }

    setResults({
      status: "ready",
      message: response.message,
      conversation: [
        ...nextConversation,
        { role: "assistant", content: response.message },
      ],
    });
  };

  return {
    userMessage,
    results,
    sendMessage,
    getInput,
  };
};
