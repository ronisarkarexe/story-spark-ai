import GraphVisualizer from "../components/GraphVisualizer";
import GraphTopicPage from "../components/GraphTopicPage";
import { graphTopics } from "../data";

export async function generateStaticParams() {
  return [
    { algorithm: "bfs" },
    { algorithm: "dfs" },
    { algorithm: "dijkstra" },
    { algorithm: "prim" },
    { algorithm: "kruskal" },
    { algorithm: "topological-sort" },
    { algorithm: "adjacency-list" },
    { algorithm: "adjacency-matrix" },
  ];
}

export async function generateMetadata({ params }) {
  const { algorithm } = await params;
  const topic = graphTopics[algorithm];

  if (!topic) return { title: "Algorithm Not Found" };

  return {
    title: `${topic.title} | AlgoBuddy Graph Visualizer`,
    description: topic.description,
    robots: "index, follow",
  };
}

export default async function Page({ params, searchParams }) {
  const { algorithm } = await params;
  const { startNode } = (await searchParams) || {};
  const topic = graphTopics[algorithm];

  if (!topic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Algorithm not found</h1>
      </div>
    );
  }

  // Define a wrapper component to ensure props are passed correctly
  const AnimationWrapper = (props) => (
    <GraphVisualizer algorithm={algorithm} {...props} />
  );

  return (
    <GraphTopicPage 
      topic={topic} 
      Animation={AnimationWrapper}
      startNode={startNode}
    />
  );
}
