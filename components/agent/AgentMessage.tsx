import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ConversationMessage } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AgentMessageProps =
  | {
      content: string;
      conversation?: never;
    }
  | {
      content?: never;
      conversation: ConversationMessage[];
    };

export function AgentMessage({ content, conversation }: AgentMessageProps) {
  const transcript: ConversationMessage[] = conversation ?? [
    { role: "assistant", content: content ?? "" },
  ];

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {transcript.map((message, index) => {
        const isUser = message.role === "user";

        return (
          <Stack
            alignItems={isUser ? "flex-end" : "flex-start"}
            key={`${message.role}-${index}`}
            sx={{ width: "100%" }}
          >
            <Paper
              elevation={0}
              sx={{
                maxWidth: "85%",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isUser
                  ? "rgba(96, 165, 250, 0.35)"
                  : "rgba(148, 163, 184, 0.18)",
                backgroundColor: isUser
                  ? "rgba(8, 47, 73, 0.9)"
                  : "rgba(15, 23, 42, 0.7)",
                color: "rgba(255, 255, 255, 0.92)",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(148, 163, 184, 0.9)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  mb: 1,
                  textTransform: "uppercase",
                }}
              >
                {isUser ? "You" : "Agent"}
              </Typography>
              <Box
                sx={{
                  lineHeight: 1.6,
                  "& > :first-of-type": {
                    mt: 0,
                  },
                  "& > :last-child": {
                    mb: 0,
                  },
                  "& p": {
                    my: 1,
                  },
                  "& pre": {
                    overflowX: "auto",
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "rgba(2, 6, 23, 0.75)",
                  },
                  "& code": {
                    fontSize: "0.9em",
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Stack>
        );
      })}
    </Stack>
  );
}
