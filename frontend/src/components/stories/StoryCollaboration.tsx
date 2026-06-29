import React, { useState } from "react";
import toast from "react-hot-toast";

interface Collaborator {
  id: number;
  name: string;
  role: "Owner" | "Editor" | "Viewer";
  status: string;
}

const StoryCollaboration: React.FC = () => {
  const [email, setEmail] = useState("");

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 1,
      name: "You",
      role: "Owner",
      status: "Active",
    },
  ]);

  const handleInvite = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const newCollaborator: Collaborator = {
      id: Date.now(),
      name: email,
      role: "Editor",
      status: "Pending Invitation",
    };

    setCollaborators([...collaborators, newCollaborator]);
    setEmail("");

    toast.success("Collaborator invited successfully!");
  };

  const removeCollaborator = (id: number) => {
    setCollaborators(
      collaborators.filter((user) => user.id !== id)
    );

    toast.success("Collaborator removed");
  };

  return (
    <div className="mt-6 bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">
        🤝 Story Collaboration
      </h2>

      {/* Invite Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="email"
          placeholder="Enter collaborator email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg px-4 py-2 bg-slate-700 text-white outline-none"
        />

        <button
          onClick={handleInvite}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold transition"
        >
          Invite
        </button>
      </div>

      {/* Collaborators List */}
      <div className="space-y-3">
        {collaborators.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-slate-700/50 rounded-xl p-3"
          >
            <div>
              <h3 className="text-white font-semibold">
                {user.name}
              </h3>

              <p className="text-sm text-slate-300">
                {user.role} • {user.status}
              </p>
            </div>

            {user.role !== "Owner" && (
              <button
                onClick={() => removeCollaborator(user.id)}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400 mt-5">
        Collaborators can contribute, review changes, and work together on the story.
      </p>
    </div>
  );
};

export default StoryCollaboration;