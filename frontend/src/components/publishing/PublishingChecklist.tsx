import ChecklistItem from "./ChecklistItem";
import {usePublishingChecklist} from "../../hooks/usePublishingChecklist";

export default function PublishingChecklist({

story

}){

const checklist=usePublishingChecklist(story);

const passed=

checklist.filter(

i=>i.status==="Passed"

).length;

const readiness=Math.round(

(passed/checklist.length)*100

);

return(

<div className="border rounded-xl p-6">

<div className="flex justify-between mb-6">

<h2 className="text-xl font-bold">

Publishing Checklist

</h2>

<button className="bg-blue-600 text-white px-4 py-2 rounded">

Run Check

</button>

</div>

<div className="mb-6">

<h3>

Publishing Readiness

</h3>

<div className="w-full bg-gray-200 rounded">

<div

style={{

width:`${readiness}%`

}}

className="bg-green-600 text-white text-center rounded"

>

{readiness}%

</div>

</div>

</div>

{

checklist.map(item=>(

<ChecklistItem

key={item.id}

item={item}

/>

))

}

</div>

);

}