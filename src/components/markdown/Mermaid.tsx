import mermaid from "mermaid";
import { useEffect, useState } from "react";

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render("mermaid-graph", chart);
        setSvg(svg);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to render Mermaid diagram. Please check the syntax.");
      }
    };

    if (chart) {
      renderMermaid();
    }
  }, [chart]);

  if (error) {
    return <div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded">{error}</div>;
  }

  if (!svg) {
    return <div>Loading diagram...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
