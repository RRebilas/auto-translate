import * as vscode from "vscode";
import { extensionConfiguration, showMessage } from "../utils/common";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SetPathToTranslationFiles = vscode.commands.registerCommand(
  "auto-translate.setPathToTranslationFiles",
  async () => {
    const inputBoxConf: vscode.InputBoxOptions = {
      title: "Specify the path where translation files are placed",
      value: undefined,
    };

    const path = await vscode.window.showInputBox(inputBoxConf);

    if (!path) {
      showMessage("No path specified");
      return;
    }

    await extensionConfiguration().update("pathToTranslationFiles", path);
  }
);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SetApiKey = vscode.commands.registerCommand(
  "auto-translate.setDeepLApiKey",
  async () => {
    const inputBoxConf: vscode.InputBoxOptions = {
      title: "Enter you key for deepL API",
      value: undefined,
    };

    const apiKey = await vscode.window.showInputBox(inputBoxConf);

    if (!apiKey) {
      showMessage("No api key specified");
      return;
    }

    await extensionConfiguration().update("deepLApiKey", apiKey);
  }
);
