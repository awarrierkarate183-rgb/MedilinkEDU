import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    localPatterns: [{ pathname: "/img/**" }],
  },
  async redirects() {
    return [
      { source: "/programs.html", destination: "/", permanent: true },
      { source: "/podcast.html", destination: "/", permanent: true },
      { source: "/blog.html", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/goals", destination: "/about#aims", permanent: true },
      { source: "/goals.html", destination: "/about#aims", permanent: true },
      { source: "/competition", destination: "/competitions", permanent: true },
      { source: "/competition.html", destination: "/competitions", permanent: true },
      { source: "/competition-middle", destination: "/competitions", permanent: true },
      { source: "/competition-middle.html", destination: "/competitions", permanent: true },
      { source: "/competition-college", destination: "/competitions", permanent: true },
      { source: "/competition-college.html", destination: "/competitions", permanent: true },
      { source: "/competition-high", destination: "/competitions#nationals", permanent: true },
      { source: "/competition-high.html", destination: "/competitions#nationals", permanent: true },
      { source: "/competition-nationals", destination: "/competitions#nationals", permanent: true },
      { source: "/competition-nationals.html", destination: "/competitions#nationals", permanent: true },
      { source: "/competition-innovation", destination: "/competitions#innovation", permanent: true },
      { source: "/competition-innovation.html", destination: "/competitions#innovation", permanent: true },
      { source: "/competition-policy", destination: "/competitions#policy", permanent: true },
      { source: "/competition-policy.html", destination: "/competitions#policy", permanent: true },
      { source: "/competition-research", destination: "/competitions#research", permanent: true },
      { source: "/competition-research.html", destination: "/competitions#research", permanent: true },
      { source: "/competition-apex", destination: "/competitions#apex", permanent: true },
      { source: "/competition-apex.html", destination: "/competitions#apex", permanent: true },
      { source: "/conferences", destination: "/competitions#ladder", permanent: true },
      { source: "/conferences.html", destination: "/competitions#ladder", permanent: true },
      { source: "/curriculum.html", destination: "/curriculum", permanent: true },
      { source: "/chapters.html", destination: "/chapters", permanent: true },
      { source: "/start-chapter", destination: "/start-a-chapter", permanent: true },
      { source: "/start-chapter.html", destination: "/start-a-chapter", permanent: true },
      { source: "/chapter-support.html", destination: "/chapter-support", permanent: true },
      { source: "/involved", destination: "/get-involved", permanent: true },
      { source: "/involved.html", destination: "/get-involved", permanent: true },
      { source: "/opportunities", destination: "/get-involved", permanent: true },
      { source: "/opportunities.html", destination: "/get-involved", permanent: true },
      { source: "/partner.html", destination: "/partner", permanent: true },
      { source: "/volunteer.html", destination: "/volunteer", permanent: true },
      { source: "/sponsor-corporate.html", destination: "/sponsor", permanent: true },
      { source: "/sponsor-individual.html", destination: "/sponsor#individual", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/portal.html", destination: "/portal", permanent: true },
    ];
  },
};

export default nextConfig;
