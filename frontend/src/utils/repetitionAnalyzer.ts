import { RepetitionIssue } from "../types/repetition";

export function analyzeRepetition(
story:string
):RepetitionIssue[]{

return [

{

id:1,

type:"Phrase",

repeatedText:"Very very dark",

occurrences:4,

severity:"High",

suggestion:
"Replace repeated phrase with richer description."

},

{

id:2,

type:"Dialogue",

repeatedText:"I don't know",

occurrences:5,

severity:"Medium",

suggestion:
"Vary dialogue to improve realism."

},

{

id:3,

type:"Description",

repeatedText:"The forest was silent.",

occurrences:3,

severity:"Low",

suggestion:
"Use alternative environmental details."

}

];

}