
/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent browsers from rendering the page inside a frame or iframe — closes
  // clickjacking attack surface on the login and dashboard pages.
  { key: "X-Frame-Options", value: "DENY" },

  // Stop browsers from MIME-sniffing responses away from the declared
  // Content-Type, blocking content-injection via mistyped uploads.
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Only send the origin (no path/query) as the Referer on cross-origin
  // requests; send the full URL within the same origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Enforce HTTPS for two years, covering all sub-domains, and opt in to
  // browser preload lists so the policy takes effect before the first request.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Disable access to hardware APIs that this app never needs.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },

  // Content Security Policy — allows exactly the origins this app loads:
  //   scripts : GA tag manager, Cloudflare Turnstile widget, Vercel Speed Insights
  //   styles  : Google Fonts CSS (+ inline Tailwind)
  //   fonts   : Google Fonts static files
  //   connect : Supabase (auth + DB), Google Analytics, Cloudflare Turnstile verify,
  //             Vercel Speed Insights reporting
  //   frames  : Cloudflare Turnstile renders inside an iframe
  //   frame-ancestors 'none' mirrors X-Frame-Options for CSP-aware browsers
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/8.x/initials/**",
      },
    ],
  },
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
