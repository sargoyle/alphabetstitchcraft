import { DisplayCard } from "./DisplayCard";

type PromptCardProps = {
  title: string;
  prompt: string;
  theme?: string;
};

export function PromptCard({ title, prompt, theme = "Prompt" }: PromptCardProps) {
  return (
    <DisplayCard
      title={title}
      subtitle={theme}
      body={prompt}
      footer={<span className="ds-prompt-mark">Creative prompt</span>}
    />
  );
}
