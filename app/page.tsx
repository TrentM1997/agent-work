"use client";
import ChatContainer from "@/components/chat/chatContainer";
import RenderAgentMessage from "@/components/pipelines/renderAgentMessage";
import { useChatWithAgent } from "@/lib/hooks/useChatWithAgent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { KeyboardEvent } from "react";

export default function Home() {
  const { getInput, results, sendMessage, userMessage } = useChatWithAgent();

  const handleComposerKeyDown = async (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    await sendMessage();
  };

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
        <Box
          sx={{
            borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
            px: { xs: 2, md: 3 },
            py: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.96)",
              fontSize: { xs: "1.35rem", md: "1.65rem" },
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Weather Agent Chat
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              maxWidth: 720,
              color: "rgba(148, 163, 184, 0.92)",
              fontSize: "0.95rem",
            }}
          >
            Ask naturally. The agent can clarify missing details or fetch the
            weather when it has enough information.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 2, md: 3 },
            py: 3,
          }}
        >
          <ChatContainer>
            {results.conversation?.length ? (
              <RenderAgentMessage results={results} />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%", minHeight: 320, textAlign: "center" }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.94)",
                    fontSize: { xs: "1.4rem", md: "1.8rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Start a conversation
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 560,
                    color: "rgba(148, 163, 184, 0.88)",
                    lineHeight: 1.7,
                  }}
                >
                  Try asking something like “What&apos;s the weather in
                  Chicago?” or “Is it a good day for a walk in Seattle?”
                </Typography>
              </Stack>
            )}
          </ChatContainer>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid rgba(148, 163, 184, 0.16)",
            px: { xs: 2, md: 3 },
            py: 2.5,
            backgroundColor: "rgba(2, 6, 23, 0.22)",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <OutlinedInput
              autoComplete="off"
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              onChange={getInput}
              onKeyDown={handleComposerKeyDown}
              placeholder="Message the weather agent..."
              value={userMessage}
              sx={{
                alignItems: "flex-start",
                borderRadius: 3,
                color: "rgba(255, 255, 255, 0.92)",
                backgroundColor: "rgba(15, 23, 42, 0.72)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(96, 165, 250, 0.24)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(96, 165, 250, 0.42)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(125, 211, 252, 0.75)",
                },
              }}
            />
            <Button
              disabled={results.status === "pending" || !userMessage.trim()}
              onClick={sendMessage}
              sx={{
                alignSelf: { xs: "stretch", sm: "flex-end" },
                minHeight: { xs: 48, sm: 56 },
                px: 3,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)",
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(56, 189, 248, 0.98) 0%, rgba(59, 130, 246, 0.98) 100%)",
                },
                "&.Mui-disabled": {
                  background: "rgba(51, 65, 85, 0.55)",
                  color: "rgba(226, 232, 240, 0.5)",
                },
              }}
              variant="contained"
            >
              {results.status === "pending" ? "Thinking..." : "Send"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
