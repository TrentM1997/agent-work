import type { ConversationMessage } from "@/lib/types";
import Message from "./message";
import React from "react";

type ChatStreamProps = {
  transcript: ConversationMessage[];
};

export default function ChatStream({ transcript }: ChatStreamProps) {
  return (
    <React.Fragment>
      {transcript.map((message, index) => {
        const isUser = message.role === "user";

        return <Message 
        index={index} 
        message={message} 
        isUser={isUser} 
        key={`${message.role}-${index}`}
        />;
      })}
    </React.Fragment>
  );
}
