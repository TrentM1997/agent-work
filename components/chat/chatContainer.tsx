"use client";
import { Container } from "@mui/material";
import Stack from "@mui/material/Stack";
import type { JSX, PropsWithChildren } from "react";

export default function ChatContainer({ children }: PropsWithChildren): JSX.Element {
  return (
    <Container
    sx={{
      paddingY: 2
    }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          height: "60svh",
        }}
      >
        {children}
      </Stack>
    </Container>
  );
}
