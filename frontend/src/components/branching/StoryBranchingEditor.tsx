import React, { useState } from "react";

interface Choice {
  id: number;
  text: string;
}

interface Branch {
  id: number;
  title: string;
  choices: Choice[];
}

export default function StoryBranchingEditor() {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      title: "Story Start",
      choices: [],
    },
  ]);

  const addBranch = () => {
    setBranches([
      ...branches,
      {
        id: Date.now(),
        title: "New Branch",
        choices: [],
      },
    ]);
  };

  const addChoice = (branchId: number) => {
    setBranches(
      branches.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              choices: [
                ...branch.choices,
                {
                  id: Date.now(),
                  text: "New Choice",
                },
              ],
            }
          : branch
      )
    );
  };

  return (
    <div>
      <h2>🌳 Story Branching Editor</h2>

      <button onClick={addBranch}>
        Add Branch
      </button>

      {branches.map((branch) => (
        <div
          key={branch.id}
          style={{
            border: "1px solid gray",
            padding: 15,
            marginTop: 15,
          }}
        >
          <input
            value={branch.title}
            onChange={() => {}}
          />

          <button
            onClick={() => addChoice(branch.id)}
          >
            Add Choice
          </button>

          {branch.choices.map((choice) => (
            <div key={choice.id}>
              • {choice.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}