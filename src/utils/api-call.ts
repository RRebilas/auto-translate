import * as deepl from "deepl-node";
import { getConfigurationProperty, showMessage } from "./common";

const authKey = getConfigurationProperty("deepLApiKey");
const translator = new deepl.Translator(authKey as string);

export const requestTranslation = async ({
  text,
  targetLang,
  sourceLang = null,
}: {
  text: string;
  targetLang: deepl.TargetLanguageCode;
  sourceLang?: deepl.SourceLanguageCode | null;
}): Promise<string | undefined> => {
  try {
    const result = await translator.translateText(text, sourceLang, targetLang);
    return result.text;
  } catch {
    showMessage("Something went wrong. Try again later");
    return undefined;
  }
};
