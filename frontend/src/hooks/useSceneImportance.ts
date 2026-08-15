import { useEffect, useState } from "react";
import { analyzeScenes } from "../utils/sceneImportanceAnalyzer";
import type { SceneScore } from "../types/scene";

export function useSceneImportance(story:string){

    const [scores,setScores]=useState<SceneScore[]>([]);

    useEffect(()=>{

        setScores(analyzeScenes(story));

    },[story]);

    return scores;

}
