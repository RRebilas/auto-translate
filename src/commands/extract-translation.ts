/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import {
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

    const key = await vscode.window.showInputBox(inputBoxConf);
    if (!key) {
      showMessage("No key specified");
    }

    const translationFilesPath = getConfigurationProperty(
      "pathToTranslationFiles"
    );
  }
);
