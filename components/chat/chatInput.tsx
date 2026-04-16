"use client";
import { WeatherResultsType } from "@/lib/types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import type { KeyboardEvent } from "react";

type ChatInputProps = {
  results: WeatherResultsType;
  getInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
  userMessage: string;
  sendMessage: () => Promise<void>;
};

export default function ChatInput({
  getInput,
  results,
  userMessage,
  sendMessage,
}: ChatInputProps) {
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
  );
}
