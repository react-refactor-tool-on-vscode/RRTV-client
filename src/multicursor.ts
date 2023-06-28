import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import {client} from './extension';

export type TabPosition = {
    position: lc.Position,
    tab: number
};


export function multiCursor(text:string) {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {return;}
    let snippet = new vscode.SnippetString(text);
    editor.insertSnippet(snippet);
}


