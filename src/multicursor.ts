import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import {client} from './extension';

export type TabPosition = {
    position: lc.Position,
    tab: number
};


export function multiCursor(start:lc.Position, text:string) {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {return;}
    let snippet = new vscode.SnippetString(text);
    const position = new vscode.Position(start.line, start.character);
    vscode.window.showInformationMessage(snippet.value);
    editor.insertSnippet(snippet, position);
}