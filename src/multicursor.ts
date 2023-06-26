import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import {client} from './extension';

export type TabPosition = {
    position: vscode.Position,
    tab: number
};


export function multiCursor(tabPositions:TabPosition[]) {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {return;}

    for(const item of tabPositions) {
        const snippet = new vscode.SnippetString;
        snippet.appendTabstop(item.tab);
        editor.insertSnippet(snippet, item.position);
    }
}