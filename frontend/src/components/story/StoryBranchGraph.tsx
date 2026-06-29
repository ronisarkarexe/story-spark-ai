import { ReactFlow, Background, Controls, Edge, MarkerType, Node, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Start Story" },
  },
  {
    id: "2",
    position: { x: 250, y: -100 },
    data: { label: "Choice A" },
  },
  {
    id: "3",
    position: { x: 250, y: 100 },
    data: { label: "Choice B" },
  },
];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
  },
];

const StoryBranchGraph = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};

export default StoryBranchGraph;