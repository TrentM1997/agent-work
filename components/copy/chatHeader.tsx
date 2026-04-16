import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { JSX } from "react";

export default function ChatHeader(): JSX.Element {

    return (
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
    )
}