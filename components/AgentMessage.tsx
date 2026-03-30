import Container from "@mui/material/Container";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AgentMessage({ content }: { content: string }) {
  return (
    <Container
    disableGutters
    >
<ReactMarkdown
remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
    </Container>
    
  );
}