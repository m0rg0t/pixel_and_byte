import type { APIRoute } from "astro";

const robots = (site: URL) => `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${new URL("sitemap-index.xml", site).href}
`;

export const GET: APIRoute = ({ site }) =>
  new Response(robots(site ?? new URL("https://pixel-and-byte.ru")), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
