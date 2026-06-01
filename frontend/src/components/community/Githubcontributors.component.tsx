import React, { useEffect, useRef, useState } from 'react'
import githubHero from "../../assets/github-hero.png";
import ImageFallback from "../ImageFallback";
interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
}

const GithubcontributorsComponent: React.FC = () => {

  const [githubcontributors, setGitHubContributors] = useState<GitHubContributor[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [repoStars, setRepoStars] = useState(0);
  const contributorsRef = useRef<HTMLDivElement | null>(null);

  const owner = "ronisarkarexe"
  const repo = "story-spark-ai"


  useEffect(() => {
    const GithubcontributorData = async () => {
      try {
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
          headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        if (!githubRes.ok) {
          throw new Error(`HTTP error! Status: ${githubRes.status}`);
        }
        const data = await githubRes.json();
        setGitHubContributors(data);

        // To fetch real time stars count
        const repoRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        if (!repoRes.ok) {
          throw new Error(`HTTP error! Status: ${repoRes.status}`);
        }

        const repoData = await repoRes.json();

        setRepoStars(repoData.stargazers_count);


      } catch (e) {
        console.log(e);
      }

    };
    GithubcontributorData();
  }, [])




  const DisplayedContributors = showAll ? githubcontributors : githubcontributors.slice(0, 6);

  return (
    <section
      className="
      relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8
      bg-white dark:bg-[#050816]
    "
      ref={contributorsRef}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-16">

          {/* LEFT */}
          <div className="max-w-3xl">

            <h1
              className="
              text-[56px] md:text-[72px]
              font-extrabold
              leading-[1.05]
              tracking-[-2px]
              text-gray-900 dark:text-white
            "
            >
              Our GitHub{" "}
              <span
                className="
                bg-gradient-to-r
                from-blue-500
                via-violet-500
                to-fuchsia-500
                bg-clip-text text-transparent
              "
              >
                Community
              </span>
            </h1>

            <p
              className="
              mt-6 text-[30px]
              text-gray-700 dark:text-gray-300
              font-medium
            "
            >
              Powered by amazing contributors 💻
            </p>

            <div className="mt-12 space-y-3">

              <p
                className="
                text-[18px] md:text-[20px]
                text-gray-600 dark:text-gray-400
                leading-relaxed
              "
              >
                These developers are the backbone of our open-source ecosystem.
              </p>

              <p
                className="
                text-[18px] md:text-[20px]
                text-gray-600 dark:text-gray-400
                leading-relaxed
              "
              >
                Thank you for building, improving and inspiring together.
              </p>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex justify-center items-center relative">

            {/* Floating Glow Particles */}

          
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-violet-500/5 to-fuchsia-500/10 blur-3xl"></div>

            <div className="absolute top-12 left-20 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-pulse"></div>

            <div className="absolute top-32 left-36 w-2 h-2 bg-violet-400 rounded-full blur-[1px] animate-pulse"></div>

            <div className="absolute top-52 left-24 w-4 h-4 bg-fuchsia-400 rounded-full blur-[3px] animate-ping"></div>

            <div className="absolute bottom-20 right-28 w-3 h-3 bg-blue-300 rounded-full blur-[2px] animate-pulse"></div>

            <div className="absolute top-24 right-16 w-2 h-2 bg-white rounded-full blur-[1px] animate-ping"></div>

            <div className="absolute bottom-40 right-10 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-pulse"></div>

            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-fuchsia-400 rounded-full blur-[1px] animate-pulse"></div>

            <div className="absolute bottom-15 left-1/3 w-4 h-4 bg-violet-300 rounded-full blur-[3px] animate-pulse"></div> 

            <img
              src={githubHero}
              alt="GitHub Hero"
              className="
              w-full max-w-[620px]
              object-contain
              drop-shadow-[0_0_60px_rgba(139,92,246,0.45)]
            animate-[float_5s_ease-in-out_infinite]
            "
            />

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-24">

          {[
            {
              title: "Contributors",
              value: githubcontributors.length,
              icon: "fa-users",
              color: "violet",
            },
            {
              title: "Commits",
              value: githubcontributors.reduce(
                (acc, curr) => acc + curr.contributions,
                0
              ),
              icon: "fa-star",
              color: "yellow",
            },
            {
              title: "Repositories",
              value: "1",
              icon: "fa-code",
              color: "green",
            },
            {
              title: "Stars",
              value: repoStars,
              icon: "fa-star",
              color: "pink",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
              h-[118px]
              rounded-[28px]
              border border-gray-200 dark:border-white/10
              bg-white dark:bg-[#0b1023]/90
              shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-none
              backdrop-blur-xl
              px-6
              flex items-center justify-between
              overflow-hidden
            "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* ICON */}
                <div
                  className={`
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center

                  ${item.color === "violet"
                      ? "bg-violet-500/15"
                      : item.color === "yellow"
                        ? "bg-yellow-500/15"
                        : item.color === "green"
                          ? "bg-green-500/15"
                          : "bg-pink-500/15"

                    }
                `}
                >
                  <i
                    className={`
                    fa-solid ${item.icon} text-2xl

                    ${item.color === "violet"
                        ? "text-violet-400"
                        : item.color === "yellow"
                          ? "text-yellow-400"
                          : item.color === "green"
                            ? "text-green-400"
                            : "text-pink-400"
                      }
                  `}
                  ></i>
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-none">
                    {item.value}
                  </h3>

                  <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* RIGHT ICON */}
              <i
                className={`
                fa-solid fa-chart-line text-4xl opacity-60

                ${item.color === "violet"
                    ? "text-violet-400"
                    : item.color === "yellow"
                      ? "text-yellow-400"
                      : item.color === "green"
                        ? "text-green-400"
                        : "text-pink-400"
                  }
              `}
              ></i>
            </div>
          ))}
        </div>



        {/* TOP CONTRIBUTOR HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div className="flex items-start gap-4">

            <div
              className="
        w-16 h-16 rounded-full
        bg-violet-500/15
        border border-violet-500/30
        flex items-center justify-center
      "
            >
              <i className="fa-solid fa-trophy text-violet-400 text-lg"></i>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Top Contributors
              </h2>

              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Recognizing the amazing people who make this project possible.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAll(!showAll);

              if (showAll) {
                contributorsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            className="
      hidden md:flex items-center gap-4
      text-violet-400
      hover:text-violet-300
      text-2xl font-semibold
      transition-colors
    "
          >
            {showAll ? "Show Less" : "Show More"}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* CONTRIBUTOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {DisplayedContributors.map((contributor, index) => {

            const rankStyles = [
              {
                border:
                  "border-yellow-500/40 shadow-[0_0_40px_rgba(250,204,21,0.18)]",
                badge:
                  "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
              },
              {
                border:
                  "border-gray-300/40 shadow-[0_0_40px_rgba(255,255,255,0.12)]",
                badge:
                  "bg-gray-400/10 border-gray-400/30 text-gray-300",
              },
              {
                border:
                  "border-orange-500/40 shadow-[0_0_40px_rgba(251,146,60,0.16)]",
                badge:
                  "bg-orange-500/10 border-orange-500/30 text-orange-400",
              },
            ];

            const defaultStyle = {
              border: "border-violet-500/10",
              badge: "bg-violet-500/10 border-violet-500/20 text-violet-400",
            };

            const style =
              index < 3 ? rankStyles[index] : defaultStyle;

            return (
              <div
                key={contributor.id}
                className={`
                group relative isolate overflow-hidden
                rounded-[26px]
                border ${style.border}
                bg-white dark:bg-[#0b1023]/95
                shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-none
                backdrop-blur-2xl
                 w-full mx-auto
                px-5 py-5
                hover:-translate-y-3
                transition-all duration-500
              `}
              >
                {/* Glow */}
                {/* Premium Gradient Background */}
             <div
  className={`absolute inset-0 opacity-100 ${
    index === 0
      ? "bg-yellow-500/10"
      : index === 1
      ? "bg-blue-500/10"
      : index === 2
      ? "bg-orange-500/10"
      : "bg-violet-500/10"
  }`}
/>

                {/* Secondary Glow */}
                <div
                  className={`
    absolute bottom-0 right-0 w-[220px] h-[220px]
    blur-[90px] rounded-full opacity-30

    ${index === 0
                      ? "bg-yellow-500"
                      : index === 1
                        ? "bg-blue-400"
                        : index === 2
                          ? "bg-orange-500"
                          : "bg-violet-500"
                    }
  `}
                ></div>

                {/* Avatar */}
                <div className="flex justify-center mb-5">
                  <ImageFallback
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="
                      w-24 h-24 rounded-full
                      object-cover
                      border-4 border-white/20
                      shadow-2xl
                    "
                    />
                </div>

                {/* Username */}
                <div className="text-center">
                  <h3
                    className="
                    text-2xl font-bold
                    text-gray-900 dark:text-white
                  "
                  >
                    {contributor.login}
                  </h3>

                  {/* Commit Badge */}
                  <div
                    className={`
                    mt-6 inline-flex items-center gap-3
                    px-4 py-2 rounded-2xl
                    border
                    ${style.badge}
                    text-sm
                  `}
                  >
                    <i className="fa-solid fa-code-branch"></i>
                    {contributor.contributions} commits
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE SHOW MORE */}
        <div className="flex md:hidden justify-center mt-10">
          <button
            onClick={() => {
              setShowAll(!showAll);

              if (showAll) {
                contributorsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            className="
            px-7 py-3 rounded-full
            bg-gradient-to-r from-violet-600 to-blue-600
            text-white font-semibold
          "
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>

      {/* CTA */}
<div
  className="
    mt-20 rounded-[36px]
    border border-violet-500/20
    bg-white dark:bg-white/[0.03]
    backdrop-blur-2xl
    p-10
    flex flex-col lg:flex-row
    items-center justify-between
    gap-5
  "
>
  <div>
    <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
      Want to contribute?
    </h3>

    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
      Check out our contributing guidelines and start making an impact today.
    </p>
  </div>


          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="
            px-8 py-5 rounded-2xl
            bg-gradient-to-r from-violet-600 to-fuchsia-600
            hover:scale-105
            text-white font-bold text-lg
            shadow-2xl
            transition-all
          "
          >
            Contribute Now →
          </a>
        </div>

  
  

      </div>

    </section >
  );

}


export default GithubcontributorsComponent;