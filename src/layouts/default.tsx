import { Navbar } from "@/components/navbar";
import { Link } from "@heroui/link";
import { Linkedin } from "lucide-react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <span className="text-default-600 mr-1">Made with ❤️ by</span>
        <Link
          isExternal
          href="https://www.linkedin.com/in/stephenharrison/"
          title="Stephen Harrison LinkedIn"
          className="flex items-center gap-1"
        >
          Stephen Harrison <Linkedin size={16} />
        </Link>
      </footer>
    </div>
  );
}
