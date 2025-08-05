import { Markdown } from "@/components/markdown/Markdown";
import docs from "@/content/docs.md?raw";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <Markdown>{docs}</Markdown>
    </DefaultLayout>
  );
}
