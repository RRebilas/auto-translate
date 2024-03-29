import * as deepl from "deepl-node";
import { getConfigurationProperty, showMessage } from "./common";

export class Translator {
  private static instance: Translator;
  private static translatorInstance: deepl.Translator;

  private constructor(apiKey: string) {
    Translator.translatorInstance = new deepl.Translator(apiKey);
  }

  public static getInstance(): Translator | null {
    const authKey = getConfigurationProperty("deepLApiKey") as string;

    if (!authKey) {
      showMessage(
        "No Api key defined. Specify one in settings or through command"
      );
      return null;
    }

    if (!Translator.instance) {
      Translator.instance = new Translator(authKey);
    }

    return Translator.instance;
  }

  public getTranslatedText = async ({
    text,
    sourceLang = null,
    targetLang,
  }: {
    text: string;
    sourceLang?: deepl.SourceLanguageCode | null;
    targetLang: deepl.TargetLanguageCode;
  }): Promise<string | undefined> => {
    try {
      const result = await Translator.translatorInstance.translateText(
        text,
        sourceLang,
        targetLang
      );
      return result.text;
    } catch {
      showMessage("Something went wrong. Try again later");
      return undefined;
    }
  };
}
