"use client";
import AgentChat from "@/components/chat/agentChat";
import ChatInput from "@/components/chat/chatInput";
import ChatHeader from "@/components/copy/chatHeader";
import { useChatWithAgent } from "@/lib/hooks/useChatWithAgent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

export default function Home() {
  const { getInput, results, sendMessage, userMessage } = useChatWithAgent();

  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        py: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 64px)",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 4,
          border: "1px solid rgba(59, 130, 246, 0.18)",
          background:
            "linear-gradient(180deg, rgba(8, 15, 27, 0.98) 0%, rgba(13, 22, 38, 0.94) 100%)",
          boxShadow: "0 24px 60px rgba(2, 6, 23, 0.45)",
        }}
      >
        <ChatHeader />

        <AgentChat results={results} />
        <ChatInput
          results={results}
          userMessage={userMessage}
          sendMessage={sendMessage}
          getInput={getInput}
        />
      </Paper>
    </Container>
  );
}
