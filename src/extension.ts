// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "auto-translate" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "auto-translate.extractTranslation",
    () => {
      // The code you place here will be executed every time your command is executed
      const selection = getHighlightedText();

      const inputBoxConf: vscode.InputBoxOptions = {
        title: "Type the name of key for translation, you want to extract",
        value: createDefaultKeyFromValue(selection),
      };

      vscode.window.showInputBox(inputBoxConf).then((key) => {
        if (!key) {
          showMessage("No key specified");
        }
        // continue
        // save key to file (for now any => specified in config)
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const getHighlightedText = (): string | undefined => {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;

  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );
    return editor.document.getText(selectionRange);
  }
};

const createDefaultKeyFromValue = (
  value: string | undefined
): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.trim().split(" ").join("_").toUpperCase();
};

const showMessage = (msg: string) => vscode.window.showInformationMessage(msg);
