import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { ExtractParams } from './extension';

export type ExtractParamsBack = {
    name: string,
    range: vscode.Range,
    document: lc.DocumentUri
};

export type StateUpgradeParamsBack = {
    pick : string,
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
	const params = args as ExtractParams[];
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

export async function stateUpgradeSelection(args:any): Promise<StateUpgradeParamsBack> {
	const params = args as ExtractParams[];
    const items = params[0].items;
    let pick = await vscode.window.showQuickPick(items);
    let name = 'stateUpgrade';
    if (pick === undefined) {pick = 'default';}
    const paramsBack = {
        pick: pick,
        range: params[0].range,
        document: params[0].document
    };
    return paramsBack;
}


export async function extractJSX(args: any): Promise<ExtractJSXParamsBack> {
    const params = args as ExtractJSXParams[];
    let name = await vscode.window.showInputBox({
        title: 'asdfasdf',
        prompt: 'asdfasdf'
    });
    if (!name) {
        name = 'default';
    }

    const paramsBack: ExtractJSXParamsBack = {
        name: name,
        range: params[0].range,
        document: params[0].document
    };

    return paramsBack;
}
export async function getAttrSelection(args:any): Promise<any[]> {
    const items:string[] = args[2];
    const document = args[0];
    const range:vscode.Range = args[1];
    let pick = await vscode.window.showQuickPick(items);
    let option = 4;
    if(!pick) {option = 4;}
    for(let i = 0; i < 4; i ++) {
        if(pick === items[i]) {
            option = i + 1;
            break;
        }
    }
    return [document, range, option];
}