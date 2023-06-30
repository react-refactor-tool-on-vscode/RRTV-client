import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { multiCursor } from './multicursor';
import { connect } from 'http2';
import * as t from "@babel/types";

export type ExtractParamsBack = {
    name: string,
    range: vscode.Range,
    document: lc.DocumentUri
};


export type AttrParamsBack = {
    pick: number | string;
    range: vscode.Range;
    document: lc.DocumentUri;
};

export type  ExtractJSXParams ={
    document: string;
    range: vscode.Range;
};

export type  ExtractJSXParamsBack ={
    name: string;
    document: string;
    range: vscode.Range;
};


export async function extractSelection(args:any): Promise<ExtractParamsBack> {
	const params = args;
    const items = params[0].items;
    let pick = await vscode.window.showQuickPick(items);
    let name = await vscode.window.showInputBox({
        title: 'Input a new name',
        prompt: 'Input a new name'
    });
    if (pick === undefined) {pick = 'default';}
    if(name === undefined) {name = 'default';}
    const paramsBack = {
        name: name,
        pick: pick,
        range: params[0].range,
        document: params[0].document
    };
    return paramsBack;
}

function loc2Range(loc:any): vscode.Range {
    return new vscode.Range(
        new vscode.Position(loc.start.line - 1, loc.start.colomn),
        new vscode.Position(loc.end.line - 1, loc.end.colomn)
    );
}

export async function stateUpgradeSelection(args:any): Promise<any[]> {
    const [uri, range, locMap, isSingle] = args;
    const editor = vscode.window.activeTextEditor;
    if(!editor) {return [];}
    let type:string = '0';
    let name = 'default name';
    const pick = await vscode.window.showQuickPick(
        ["To an existed component", "To a new component"], 
        {title:"choose one parent component or create a new component"}
    ) ?? 'To a new component';
    if(pick === 'To a new component') {
        type = '1';
        name = await vscode.window.showInputBox({prompt: "input a new name here"}) ?? 'default';
    } else {
        name = pick;
    }
    return [uri, range, locMap, isSingle, type, name];

}


export async function extractJSX(args: any) {
    const newText = args[0];
    const newRange = args[1];
    const editor = vscode.window.activeTextEditor;
    if(!editor) {return;}
    vscode.window.showInformationMessage(JSON.stringify(newRange));
    editor.insertSnippet(new vscode.SnippetString(newText), new vscode.Range(newRange.start, newRange.end));
}

export async function getAttrSelection(args:any): Promise<any[]> {
    const items:string[] = args[2];
    const document = args[0];
    const range:vscode.Range = args[1];
    let pick = await vscode.window.showQuickPick(items);
    let option = 4;
    if(!pick) {option = 5;}
    for(let i = 0; i < 4; i ++) {
        if(pick === items[i]) {
            option = i + 1;
            break;
        }
    }
    return [document, range, option];
}