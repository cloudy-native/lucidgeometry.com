import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { markdownComponents } from "./renderers";

import 'katex/dist/katex.min.css' // Import KaTeX CSS

interface MarkdownProps {
  children: string;
}

// It's pretty awesome how easy and flexible it is to include and customize the format of Markdown
//
export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <article className="w-full p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
};
