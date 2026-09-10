export interface SceneNode {
  id: number;
  title: string;
  dependsOn: number[];
}

export function getSceneDependencies(): SceneNode[] {
  return [
    {
      id: 1,
      title: "Opening Mystery",
      dependsOn: [],
    },
    {
      id: 2,
      title: "First Investigation",
      dependsOn: [1],
    },
    {
      id: 3,
      title: "Hidden Clue",
      dependsOn: [2],
    },
    {
      id: 4,
      title: "Final Confrontation",
      dependsOn: [2, 3],
    },
    {
      id: 5,
      title: "Ending",
      dependsOn: [4],
    },
  ];
}