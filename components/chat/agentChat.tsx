"use client";
import ChatContainer from "@/components/chat/chatContainer";
import RenderAgentMessage from "@/components/pipelines/renderAgentMessage";
import { WeatherResultsType } from "@/lib/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { JSX } from "react";

export default function AgentChat({
  results,
}: {
  results: WeatherResultsType;
}): JSX.Element {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        paddingX: { xs: 2, md: 3 },
        paddingY: 3,
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
              Try asking something like “What&apos;s the weather in Chicago?” or
              “Is it a good day for a walk in Seattle?”
            </Typography>
          </Stack>
        )}
      </ChatContainer>
    </Box>
  );
}
