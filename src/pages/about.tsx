import { Markdown } from "@/components/markdown/Markdown";
import about from "@/content/about.md?raw";
import DefaultLayout from "@/layouts/default";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <Markdown>{about}</Markdown>
    </DefaultLayout>
  );
}
