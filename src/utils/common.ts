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

export const replaceTextWithTranslation = (
  selection: vscode.Selection,
  key: string,
  params: RegExpMatchArray | null
): void => {
  const editor = vscode.window.activeTextEditor;
  const fileName = editor?.document.fileName;
  const paramsContent = buildParametersContent(params);
  let finalContent = "";
  let baseContent = fileName?.endsWith(".html")
    ? `"${key}" | translate`
    : `'${key}'`;

  if (paramsContent) {
    finalContent = fileName?.endsWith(".html")
      ? `${baseContent}: ${paramsContent} `
      : `${baseContent}, ${paramsContent}`;
  } else {
    finalContent = baseContent;
  }

  editor?.edit((builder) => {
    builder.replace(selection, finalContent);
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

export const buildParametersContent = (parameters: RegExpMatchArray | null) => {
  let content = (params: string) => `{${params}}`;
  let paramsContent = "";

  parameters?.forEach(
    // Remove {{}} to keep only parameters names
    (param, index) =>
      (paramsContent += `${param.slice(2, -2)}: ''${
        index === parameters.length - 1 ? "" : ", "
      }`)
  );

  return !paramsContent ? "" : content(paramsContent);
};

export const getTranslationParametersFromText = (
  translation: string
): RegExpMatchArray | null => {
  const curlyBracesRegex = /\{\{\s*(.+?)\s*\}\}/g;
  return translation.match(curlyBracesRegex);
};

export type ConfigurationKeys = "pathToTranslationFiles" | "deepLApiKey";
