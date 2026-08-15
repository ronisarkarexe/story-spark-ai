import RepetitionCard from "./RepetitionCard";
import { useRepetitionAnalysis } from "../../hooks/useRepetitionAnalysis";

interface RepetitionDetectorProps {
  story: string;
}

export default function RepetitionDetector({

story

}: RepetitionDetectorProps){

const issues=useRepetitionAnalysis(story);

return(

<div className="border rounded-xl p-6">

<div className="flex justify-between mb-6">

<h2 className="text-xl font-bold">

Story Repetition Detector

</h2>

<button

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Scan Story

</button>

</div>

{

issues.map(issue=>(

<RepetitionCard

key={issue.id}

issue={issue}

/>

))

}

</div>

);

}
