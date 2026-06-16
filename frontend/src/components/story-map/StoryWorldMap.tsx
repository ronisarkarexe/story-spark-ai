import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { parseStory, IStoryNode } from "../../utils/storyParser";

interface Props {
  story: string;
  title: string;
  onClose: () => void;
}

interface SimNode extends IStoryNode, d3.SimulationNodeDatum {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
}

const getNodePosition = (node: string | number | SimNode, axis: "x" | "y") =>
  typeof node === "object" ? node[axis] ?? 0 : 0;

export default function StoryWorldMap({ story, title, onClose }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    let { nodes, links } = parseStory(story);

    if (nodes.length === 0) {
      nodes = [
        { id: "loc_1", name: "Forest", type: "location", excerpt: "A dark forest..." },
        { id: "loc_2", name: "Castle", type: "location", excerpt: "An ancient castle..." },
        { id: "loc_3", name: "Village", type: "location", excerpt: "A quiet village..." },
        { id: "char_1", name: "Hero", type: "character", excerpt: "The hero..." },
        { id: "char_2", name: "Villain", type: "character", excerpt: "The villain..." },
      ];
      links = [
        { source: "char_1", target: "loc_1" },
        { source: "char_2", target: "loc_2" },
        { source: "loc_1", target: "loc_2" },
        { source: "loc_2", target: "loc_3" },
      ];
    }

    const width = svgRef.current.clientWidth || 800;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#0d0d14");

    const container = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        container.attr("transform", event.transform.toString());
      });
    svg.call(zoom);

    const simNodes: SimNode[] = nodes.map((node) => ({ ...node }));
    const simLinks: SimLink[] = links.map((link) => ({ ...link }));

    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks)
        .id((node: SimNode) => node.id)
        .distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(50));

    const link = container.append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "rgba(99,102,241,0.4)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");

    const node = container.append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(simNodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on("start", (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, node: SimNode) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            node.fx = node.x;
            node.fy = node.y;
          })
          .on("drag", (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, node: SimNode) => {
            node.fx = event.x;
            node.fy = event.y;
          })
          .on("end", (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, node: SimNode) => {
            if (!event.active) simulation.alphaTarget(0);
            node.fx = null;
            node.fy = null;
          })
      );

    node.append("circle")
      .attr("r", (node: SimNode) => node.type === "location" ? 28 : 20)
      .attr("fill", (node: SimNode) => node.type === "location"
        ? "rgba(99,102,241,0.2)"
        : "rgba(236,72,153,0.2)")
      .attr("stroke", (node: SimNode) => node.type === "location" ? "#6366f1" : "#ec4899")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (node: SimNode) => node.type === "location" ? "18px" : "14px")
      .text((node: SimNode) => node.type === "location" ? "Pin" : "User");

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", (node: SimNode) => node.type === "location" ? 40 : 32)
      .attr("fill", (node: SimNode) => node.type === "location" ? "#a5b4fc" : "#f9a8d4")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text((node: SimNode) => node.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (link: SimLink) => getNodePosition(link.source, "x"))
        .attr("y1", (link: SimLink) => getNodePosition(link.source, "y"))
        .attr("x2", (link: SimLink) => getNodePosition(link.target, "x"))
        .attr("y2", (link: SimLink) => getNodePosition(link.target, "y"));
      node.attr("transform", (node: SimNode) => `translate(${node.x ?? 0},${node.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [story]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#0d0d14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Story World Map</h2>
            <p className="text-xs text-white/40 mt-0.5">{title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-indigo-500/50 border border-indigo-400 inline-block" />
                Locations
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-pink-500/50 border border-pink-400 inline-block" />
                Characters
              </span>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition text-xl">Close</button>
          </div>
        </div>
        <div style={{ height: "500px" }}>
          <svg ref={svgRef} width="100%" height="500" />
        </div>
        <div className="border-t border-white/10 px-6 py-3">
          <p className="text-xs text-white/30">Drag to rearrange. Scroll to zoom. Click to explore.</p>
        </div>
      </div>
    </div>
  );
}
