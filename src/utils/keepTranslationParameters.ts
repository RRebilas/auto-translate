import { getTranslationParametersFromText } from "./common";

export default (text: string, translatedText: string): string => {
  // regex for words wrapped in curly braces
  const curlyBracesRegex = /\{\{\s*(.+?)\s*\}\}/g;

  // find all matches of curlyBracesRegex in testText
  const curlyBracesMatches = getTranslationParametersFromText(text);

  if (!curlyBracesMatches?.length) {
    return translatedText;
  }

  translatedText.match(curlyBracesRegex)?.forEach((match, index) => {
    translatedText = translatedText.replace(match, curlyBracesMatches[index]);
  });

  return translatedText;
};
