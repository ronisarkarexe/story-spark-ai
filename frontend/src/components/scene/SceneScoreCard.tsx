import { SceneScore } from "../../types/scene";

interface Props{

scene:SceneScore;

}

export default function SceneScoreCard({

scene

}:Props){

return(

<div className="border rounded-lg p-4 mb-4">

<h3 className="font-semibold">

{scene.title}

</h3>

<div className="mt-2">

Importance Score

</div>

<div className="w-full bg-gray-200 rounded h-3">

<div

className="bg-green-500 h-3 rounded"

style={{width:`${scene.importance}%`}}

></div>

</div>

<p className="mt-3 font-medium">

{scene.importance}/100

</p>

<div className="mt-4">

{scene.reasons.map((r,i)=>(

<p key={i}>• {r}</p>

))}

</div>

<div className="mt-4 p-3 rounded bg-blue-50">

<strong>Recommendation</strong>

<p>{scene.recommendation}</p>

</div>

{scene.needsRevision && (

<span className="text-red-600 font-semibold">

Needs Revision

</span>

)}

</div>

);

}