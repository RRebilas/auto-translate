/* eslint-disable @typescript-eslint/naming-convention */
import { TargetLanguageCode } from "deepl-node";
import * as vscode from "vscode";
import {
  assignValueByPath,
  createDefaultKeyFromValue,
  getConfigurationProperty,
  getHighlightedText,
  getTranslationParametersFromText,
  replaceTextWithTranslation as replaceTextWithTranslationKey,
  showMessage,
} from "../utils/common";
import { Translator } from "../utils/deepl";
import replaceParameters from "../utils/keepTranslationParameters";
import languageMapper from "../utils/language-mapper";

export const ExtractTranslation = vscode.commands.registerCommand(
  "auto-translate.extractTranslation",
  async () => {
    const { selectedText, selection } = getHighlightedText();

    if (!selectedText) {
      showMessage("You did not selected any text");
      return;
    }

    const inputBoxConf: vscode.InputBoxOptions = {
      title: "Type the name of key for translation, you want to extract",
      value: createDefaultKeyFromValue(selectedText),
    };

    const keyPath = (
      await vscode.window.showInputBox(inputBoxConf)
    )?.toUpperCase();

    if (!keyPath) {
      showMessage("No key specified");
      return;
    }

    const translationFilesPath = String(
      getConfigurationProperty("pathToTranslationFiles")
    ).replace(/\/$/, "");

    if (!translationFilesPath) {
      showMessage(
        "No path to directory with i18n files specified. Set one in extenstion configuration"
      );
      return;
    }

    const filesPaths = await vscode.workspace.findFiles(
      `**${translationFilesPath}/*.json`
    );

    if (!filesPaths?.length) {
      showMessage("No files found. Check extension configuration");
      return;
    }

    const translator = Translator.getInstance();

    filesPaths.forEach(async (uri) => {
      const content = (await vscode.workspace.fs.readFile(uri)).toString();
      const originalObject = JSON.parse(content);

      const translation = await translator?.getTranslatedText({
        text: selectedText,
        targetLang: languageMapper(uri) as TargetLanguageCode,
      });

      if (!translation) {
        return;
      }

      const textWithOriginalParameters = replaceParameters(
        selectedText,
        translation
      );

      assignValueByPath(originalObject, keyPath, textWithOriginalParameters);

      vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(JSON.stringify(originalObject, null, 4), "utf-8")
      );
    });

    replaceTextWithTranslationKey(
      selection,
      keyPath,
      getTranslationParametersFromText(selectedText)
    );
  }
);
