/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import {
  assignValueByPath,
  createDefaultKeyFromValue,
  getConfigurationProperty,
  getHighlightedText,
  showMessage,
} from "../utils";

import fetch from "node-fetch";

export const ExtractTranslation = vscode.commands.registerCommand(
  "auto-translate.extractTranslation",
  async () => {
    // The code you place here will be executed every time your command is executed
    const selection = getHighlightedText();

    const inputBoxConf: vscode.InputBoxOptions = {
      title: "Type the name of key for translation, you want to extract",
      value: createDefaultKeyFromValue(selection),
    };

    const keyPath = await vscode.window.showInputBox(inputBoxConf);

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

    filesPaths.forEach(async (uri) => {
      const content = (await vscode.workspace.fs.readFile(uri)).toString();
      const originalObject = JSON.parse(content);
      const body = JSON.stringify({ text: [selection], target_lang: "DE" });

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
        Buffer.from(JSON.stringify(originalObject))
      );
    });
  }
);
