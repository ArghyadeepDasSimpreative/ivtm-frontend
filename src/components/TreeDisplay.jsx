import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

export default function TreeDisplay({ data }) {
  const treeData = [
    {
      name: data.function,
      children: data.subcategories.map((sub) => ({ name: sub })),
    },
  ];

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "50vh" }}
      className="bg-slate-300 rounded-xl border border-white/10"
    >
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: dimensions.width / 4, y: dimensions.height / 2 }}
        pathFunc="step" // makes lines curvy-ish (like S-shape)
        separation={{ siblings: 1.5, nonSiblings: 2 }} // increase gaps
        styles={{
          nodes: {
            node: {
              circle: { fill: "#ffffff", stroke: "#ffffff", r: 10 },
              name: {
                fill: "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
                transform: "translateY(-20px)", // push text slightly up
              },
            },
            leafNode: {
              circle: { fill: "#ffffff", stroke: "#ffffff", r: 8 },
              name: {
                fill: "#ffffff",
                fontSize: 14,
                transform: "translateY(-16px)", // push text up from node
              },
            },
          },
          links: {
            stroke: "#60a5fa", // sky-400 color
            strokeWidth: 2.5,
          },
        }}
      />
    </div>
  );
}
