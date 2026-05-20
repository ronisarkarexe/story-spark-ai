"use client";

import GraphAnimation from "@/app/visualizer/graph/components/GraphAnimation";
import { graphTopics } from "@/app/visualizer/graph/data";

export default function Animation() {
  return (
    <GraphAnimation
      type={graphTopics.bfs.animationType}
      title={graphTopics.bfs.title}
    />
  );
}
