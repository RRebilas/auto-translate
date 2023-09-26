import fetch from "node-fetch";
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import languageMapper from "../language-mapper";
import {
  assignValueByPath,
  createDefaultKeyFromValue,
  getConfigurationProperty,
  getHighlightedText,
  replaceTextWithKey,
  showMessage,
} from "../utils";

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

    // TODO: extract it to separate functions

    filesPaths.forEach(async (uri) => {
      const content = (await vscode.workspace.fs.readFile(uri)).toString();
      const originalObject = JSON.parse(content);
      const body = JSON.stringify({
        // TODO: handle parameters: do not translate
        text: [selectedText],
        target_lang: languageMapper(uri),
      });

      // TODO: add error catching
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        body,
        headers: {
          Authorization:
            "DeepL-Auth-Key a7c5e747-8a64-3a6c-e165-14469abbb718:fx",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const translatedSelection: {
        translations: [{ detected_source_language: string; text: string }];
      } = (await response.json()) as any;

      assignValueByPath(
        originalObject,
        keyPath,
        translatedSelection.translations[0].text
      );

      vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(JSON.stringify(originalObject, null, 4), "utf-8")
      );
    });

    // if in html, then translate pipe else key only
    replaceTextWithKey(selection, keyPath);
  }
);
