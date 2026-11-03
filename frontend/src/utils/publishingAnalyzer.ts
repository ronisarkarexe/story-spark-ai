import { ChecklistItem } from "../types/publishing";

export function analyzeStory(story:string):ChecklistItem[]{

return[

{

id:1,

category:"Grammar",

status:"Passed",

message:"Grammar looks good.",

suggestion:""

},

{

id:2,

category:"Dialogue",

status:"Warning",

message:"Dialogue could be more varied.",

suggestion:"Differentiate each character's speech."

},

{

id:3,

category:"Plot",

status:"Failed",

message:"Unresolved subplot detected.",

suggestion:"Resolve the missing conflict."

}

];

}