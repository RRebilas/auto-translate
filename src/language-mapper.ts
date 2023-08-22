import * as vscode from "vscode";

export default (path: vscode.Uri) =>
  path
    .toString()
    .split("/")
    .splice(-1)
    .map((value) => value.replace(".json", ""))
    .map((value) => (value.toLowerCase() === "en" ? `${value}-us` : value))[0]
    .toUpperCase();
