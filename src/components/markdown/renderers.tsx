import { title } from "@/components/primitives";
import Mermaid from "./Mermaid";
import { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ ...props }) => (
    <h1
      {...props}
      className={title({
        size: "lg",
        class: "mt-8 mb-8",
        fullWidth: true,
      })}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      {...props}
      className={title({
        size: "md",
        class: "mt-8 mb-8",
        fullWidth: true,
      })}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      {...props}
      className={title({
        size: "sm",
        class: "mt-8 mb-8",
        fullWidth: true,
      })}
    />
  ),
  h4: ({ ...props }) => (
    <h4 {...props} className="text-2xl font-bold mt-6 mb-5" />
  ),
  h5: ({ ...props }) => (
    <h5 {...props} className="text-xl font-bold mt-5 mb-4" />
  ),
  h6: ({ ...props }) => (
    <h6 {...props} className="text-lg font-bold mt-4 mb-3" />
  ),
  p: ({ ...props }) => (
    <p {...props} className="text-default-700 mb-4" />
  ),
  ul: ({ ...props }) => (
    <ul
      {...props}
      className="list-disc list-inside pl-4 text-default-700 mb-4"
    />
  ),
  ol: ({ ...props }) => (
    <ol
      {...props}
      className="list-decimal list-inside pl-4 text-default-700 mb-4"
    />
  ),
  a: ({ ...props }) => (
    <a {...props} className="text-blue-500 hover:underline" />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      {...props}
      className="border-l-4 border-default-300 pl-4 italic text-default-600 mb-4"
    />
  ),
  hr: ({ ...props }) => (
    <hr {...props} className="border-t border-default-200 my-8" />
  ),
  pre: ({ node, ...props }) => {
    const codeNode = node?.children[0];

    if (codeNode && codeNode.type === 'element' && codeNode.tagName === 'code') {
      const className = codeNode.properties?.className || [];
      const match = /language-(\w+)/.exec(Array.isArray(className) ? className.join(' ') : String(className));
      const codeText = codeNode.children[0]?.type === 'text' ? codeNode.children[0].value : '';

      if (match && match[1] === 'mermaid') {
        return (
          <div className="mb-4">
            <Mermaid chart={codeText} />
          </div>
        );
      }

      return (
        <pre className="bg-gray-900 text-white font-mono text-sm p-4 rounded-md overflow-x-auto mb-4">
          <code>{codeText}</code>
        </pre>
      );
    }

    return <pre {...props} className="mb-4" />;
  },
};
