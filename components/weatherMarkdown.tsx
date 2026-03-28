import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Message({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}