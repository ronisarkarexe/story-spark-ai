import React, { useEffect, useRef, useState } from 'react';

interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
}

const GithubcontributorsComponent : React.FC = () =>{

  const [githubcontributors, setGitHubContributors] = useState<GitHubContributor[]>([]);
  const [showAll, setShowAll] = useState(false);
  const contributorsRef = useRef<HTMLDivElement | null> (null);

  const owner = "ronisarkarexe"
  const repo = "story-spark-ai"


  useEffect(()=>{
    const GithubcontributorData = async()=>{
      try{
          const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`,{
          headers:{
            'Accept':'application/vnd.github+json',
            'X-GitHub-Api-Version':'2022-11-28'
          }
        });
        if(!githubRes.ok){
          throw new Error(`HTTP error! Status: ${githubRes.status}`);
        }
        const data = await githubRes.json();
        setGitHubContributors(data);
    
      
      } catch (err: unknown) {
        console.error("Failed to load GitHub contributors", err);
      }
        
    };
    GithubcontributorData();
  },[])
  

const DisplayedContributors = showAll? githubcontributors :githubcontributors.slice(0,6);

return(
  <section className="max-w-7xl mx-auto px-6 py-20" ref={contributorsRef}>
<div className="p-12 bg-white/5 rounded-3xl border border-white/10">
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold mb-4">Our GitHub Community </h2>
    <p className="text-gray-400">Powered by amazing contributors</p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

    {DisplayedContributors.map((contributor) => (

         <div key={contributor.id} className="flex flex-col items-center text-center group">

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <img 
            src={contributor.avatar_url} 
            alt={contributor.login} 
            className="w-24 h-24 rounded-full border-2 border-white/10 group-hover:border-blue-500 transition-colors relative z-10 object-cover" 
          />
        </div>
        <h3 className="text-xl font-bold mb-1">{contributor.login}</h3>
        <p className="text-blue-400 text-sm mb-4">Commits: {contributor.contributions}</p>

      </div>
     
    ))}
  </div>
  <button onClick={()=>{setShowAll(!showAll);
  
  if(showAll){
    contributorsRef.current?.scrollIntoView({
      behavior:"smooth",
      block:"start",
    });
  }

  }}  className="text-blue-400 text-sm flex w-full justify-end items-center">{showAll ? "Show Less" : "Show More" }<i className="fa-solid fa-arrow-right ml-1 "></i></button>
</div>
</section>

)


}


export default GithubcontributorsComponent;