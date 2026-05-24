
/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/visualizer/graph/traversal/bfs',
				destination: '/visualizer/graph/bfs',
				permanent: true,
			},
			{
				source: '/visualizer/graph/traversal/dfs',
				destination: '/visualizer/graph/dfs',
				permanent: true,
			},
			{
				source: '/visualizer/graph/algorithms/dijkstra',
				destination: '/visualizer/graph/dijkstra',
				permanent: true,
			},
			{
				source: '/visualizer/graph/algorithms/prim',
				destination: '/visualizer/graph/prim',
				permanent: true,
			},
			{
				source: '/visualizer/graph/algorithms/kruskal',
				destination: '/visualizer/graph/kruskal',
				permanent: true,
			},
			{
				source: '/visualizer/graph/algorithms/topological-sort',
				destination: '/visualizer/graph/topological-sort',
				permanent: true,
			},
			{
				source: '/visualizer/graph/representation/adjacency-list',
				destination: '/visualizer/graph/adjacency-list',
				permanent: true,
			},
			{
				source: '/visualizer/graph/representation/adjacency-matrix',
				destination: '/visualizer/graph/adjacency-matrix',
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
				],
			},
		];
	},
};

export default nextConfig;
