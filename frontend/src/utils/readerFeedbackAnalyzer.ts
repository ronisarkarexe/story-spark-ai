import { ReaderFeedback } from "../types/readerFeedback";

export function analyzeReaderFeedback(
story:string,
persona:string
):ReaderFeedback{

return{

id:1,

persona,

engagement:90,

pacing:82,

clarity:88,

emotion:91,

overall:88,

strengths:[
"Interesting beginning",
"Strong emotional moments"
],

improvements:[
"Middle section feels slow",
"Ending could be stronger"
],

summary:
"The story is enjoyable and emotionally engaging."

};

}