
/**
 * Truncates a string to a maximum length, adding an ellipsis suffix.
 * Attempts to break at a word boundary when possible.
 *
 * @param text - The input string to truncate
 * @param maxLength - The maximum length of the result (including suffix)
 * @param suffix - The suffix to append when truncation occurs (default: '...')
 * @returns The truncated string
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (maxLength < suffix.length) {
    return text.slice(0, maxLength);
  }

  if (text.length <= maxLength) {
    return text;
  }

  // Try to break at a word boundary
  const truncated = text.slice(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + suffix;
  }

  return truncated + suffix;
};

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

