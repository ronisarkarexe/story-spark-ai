import logger from "../utils/logger.util";
export const saveCharacter = async (characterData: any) => {
  // Logic to save character to backend
  logger.debug("Saving character:", characterData);
};

export const getCharacters = async () => {
  // Logic to fetch saved characters
  return [];
};
