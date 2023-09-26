import * as vscode from "vscode";

export const showMessage = (msg: string) =>
  vscode.window.showInformationMessage(msg);

export const createDefaultKeyFromValue = (
  value: string | undefined
): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.trim().split(" ").join("_").toUpperCase();
};

export const extensionConfiguration = (): vscode.WorkspaceConfiguration => {
  return vscode.workspace.getConfiguration("autoTranslate.settings");
};

export const getConfigurationProperty = (key: ConfigurationKeys): unknown => {
  return extensionConfiguration().get(key);
};

export const getHighlightedText = (): {
  selectedText: string;
  selection: vscode.Selection;
} => {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;

  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );

    return {
      selectedText: editor.document.getText(selectionRange),
      selection: selection,
    };
  }
  return {} as { selectedText: string; selection: vscode.Selection };
};

export const replaceTextWithKey = (
  selection: vscode.Selection,
  key: string
): void => {
  const editor = vscode.window.activeTextEditor;
  editor?.edit((builder) => {
    builder.replace(selection, key);
  });
};

export const assignValueByPath = (
  obj: any,
  keyPath: string,
  value: any
): void => {
  const keys = keyPath.split(".");
  let currentObj = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!currentObj[key]) {
      currentObj[key] = {}; // Create an empty object if the key doesn't exist
    }
    currentObj = currentObj[key]; // Continue traversing the existing object
  }

  const finalKey = keys[keys.length - 1];
  currentObj[finalKey] = value;
};

export type ConfigurationKeys = "pathToTranslationFiles" | "deepLApiKey";
