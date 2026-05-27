// utils/graph.js
// Pure graph logic — no React, no DOM. Works for both directed and undirected graphs.

/**
 * Build adjacency list from edges
 * @param {number} nodeCount
 * @param {Array<{from: number, to: number}>} edges
 * @param {boolean} isDirected
 * @returns {Object} adjacency list  e.g. { 0: [1, 2], 1: [3, 4] }
 */
export function buildAdjacencyList(nodeCount, edges, isDirected) {
  const adj = {};
  for (let i = 0; i < nodeCount; i++) adj[i] = [];

  for (const { from, to } of edges) {
    adj[from].push(to);
    if (!isDirected) adj[to].push(from);
  }
  return adj;
}

/**
 * Build adjacency matrix from edges
 * @param {number} nodeCount
 * @param {Array<{from: number, to: number}>} edges
 * @param {boolean} isDirected
 * @returns {number[][]} n×n matrix
 */
export function buildAdjacencyMatrix(nodeCount, edges, isDirected) {
  const matrix = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));
  for (const { from, to } of edges) {
    matrix[from][to] = 1;
    if (!isDirected) matrix[to][from] = 1;
  }
  return matrix;
}

/**
 * BFS traversal — returns ordered array of step snapshots
 * Each step: { visited: Set, current: number, queue: number[] }
 * @param {Object} adj adjacency list
 * @param {number} start starting node
 * @returns {Array} steps
 */
export function bfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift();
    steps.push({ current, visited: new Set(visited), queue: [...queue] });

    for (const neighbor of (adj[current] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return steps;
}

/**
 * DFS traversal — returns ordered array of step snapshots
 * Each step: { visited: Set, current: number, stack: number[] }
 * @param {Object} adj adjacency list
 * @param {number} start starting node
 * @returns {Array} steps
 */
export function dfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();

  function dfs(node) {
    visited.add(node);
    steps.push({ current: node, visited: new Set(visited), stack: [] });
    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
  }

  dfs(start);
  return steps;
}

/**
 * Detect cycle in a directed graph using DFS
 * @param {number} nodeCount
 * @param {Object} adj adjacency list
 * @returns {boolean}
 */
export function hasCycleDirected(nodeCount, adj) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = Array(nodeCount).fill(WHITE);

  function dfs(u) {
    color[u] = GRAY;
    for (const v of (adj[u] || [])) {
      if (color[v] === GRAY) return true;
      if (color[v] === WHITE && dfs(v)) return true;
    }
    color[u] = BLACK;
    return false;
  }

  for (let i = 0; i < nodeCount; i++) {
    if (color[i] === WHITE && dfs(i)) return true;
  }
  return false;
}

/**
 * Topological sort (Kahn's algorithm) — only valid for directed acyclic graphs
 * @param {number} nodeCount
 * @param {Object} adj adjacency list
 * @returns {number[] | null} sorted order, or null if cycle detected
 */
export function topologicalSort(nodeCount, adj) {
  const inDegree = Array(nodeCount).fill(0);
  for (let u = 0; u < nodeCount; u++) {
    for (const v of (adj[u] || [])) inDegree[v]++;
  }

  const queue = [];
  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const v of (adj[u] || [])) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return order.length === nodeCount ? order : null; // null = cycle exists
}