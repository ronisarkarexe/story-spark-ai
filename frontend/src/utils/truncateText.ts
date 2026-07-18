export const truncateText = (
    text: string,
    maxLength: number,
    suffix: string = '...'
): string => {
    if(!text || text.length <= maxLength){
        return text
    }


    if(maxLength <= suffix.length){
        return suffix.substring(0,maxLength)
    }

    const allowedLength = maxLength - suffix.length
    let resultText = text.substring(0,allowedLength)

    if(text[allowedLength] !== " " && text[allowedLength -1] !== " "){
        const lastSpaceIndex = resultText.lastIndexOf(" ")
        if(lastSpaceIndex !== -1){
            resultText = resultText.substring(0,lastSpaceIndex)
        }
    }


    return resultText.trimEnd() + suffix
}