import AgentChatPage from "@/components/pages/agentChatPage";
import Container from "@mui/material/Container";

export default function Home() {

  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        py: { xs: 2, md: 4 },
      }}
    >
     <AgentChatPage />
    </Container>
  );
}
