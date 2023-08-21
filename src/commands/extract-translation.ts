/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import {
  assignValueByPath,
  createDefaultKeyFromValue,
  getConfigurationProperty,
  getHighlightedText,
  showMessage,
} from "../utils";

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
      assignValueByPath(originalObject, keyPath, selection);
      vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(JSON.stringify(originalObject))
      );
    });
  }
);
