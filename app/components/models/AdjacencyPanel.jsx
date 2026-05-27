// app/components/models/AdjacencyPanel.jsx
"use client";
import { useMemo } from "react";
import { buildAdjacencyList, buildAdjacencyMatrix } from "@/utils/graph";

export default function AdjacencyPanel({ nodes, edges, isDirected }) {
  const nodeCount = nodes.length;
  const nodeIds = nodes.map((n) => n.id);

  // Re-index edges to 0..n-1 for matrix
  const idToIndex = Object.fromEntries(nodeIds.map((id, i) => [id, i]));
  const reindexedEdges = edges.map((e) => ({
    from: idToIndex[e.from] ?? e.from,
    to: idToIndex[e.to] ?? e.to,
  }));

  const adjList = useMemo(
    () => buildAdjacencyList(nodeCount, reindexedEdges, isDirected),
    [nodeCount, reindexedEdges, isDirected]
  );

  const adjMatrix = useMemo(
    () => buildAdjacencyMatrix(nodeCount, reindexedEdges, isDirected),
    [nodeCount, reindexedEdges, isDirected]
  );

  if (nodeCount === 0) {
    return (
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        Add nodes to the canvas to see representations.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Adjacency List */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6b7280", marginBottom: 8 }}>
          ADJACENCY LIST {isDirected ? "(directed — outgoing only)" : "(undirected)"}
        </p>
        <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: "1.8" }}>
          {nodeIds.map((id, i) => (
            <div key={id}>
              <span style={{ color: "#a855f7" }}>{i}:</span>{" "}
              <span style={{ color: "#d1d5db" }}>
                [{adjList[i]?.map((n) => nodeIds[n] ?? n).join(", ")}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Adjacency Matrix */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6b7280", marginBottom: 8 }}>
          ADJACENCY MATRIX {isDirected ? "(asymmetric for directed)" : ""}
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 13, fontFamily: "monospace" }}>
            <thead>
              <tr>
                <th style={thStyle} />
                {nodeIds.map((id, i) => (
                  <th key={i} style={{ ...thStyle, color: "#a855f7" }}>{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjMatrix.map((row, r) => (
                <tr key={r}>
                  <td style={{ ...thStyle, color: "#a855f7" }}>{r}</td>
                  {row.map((val, c) => (
                    <td
                      key={c}
                      style={{
                        ...tdStyle,
                        color: val === 1 ? "#22c55e" : "#4b5563",
                        fontWeight: val === 1 ? 600 : 400,
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isDirected && (
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>
            matrix[u][v] = 1 means edge u → v exists. Asymmetry indicates directed edges.
          </p>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "4px 12px",
  textAlign: "center",
  color: "#9ca3af",
  fontWeight: 500,
};

const tdStyle = {
  padding: "4px 12px",
  textAlign: "center",
  borderTop: "1px solid #1f2937",
};