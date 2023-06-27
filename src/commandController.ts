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
}

export type  ExtractJSXParamsBack ={
    name: string;
    document: string;
    range: vscode.Range;
}

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
    let name = 'stateUpgrade'
    if (pick === undefined) {pick = 'default';}
    const paramsBack = {
        pick: pick,
        range: params[0].range,
        document: params[0].document
    };
    return paramsBack;
}

export async function getAttrSelection(args:any): Promise<AttrParamsBack> {
    const items:string[] = args[0].items;
    const document = args[0].document;
    const range:vscode.Range = args[0].range;
    let pick = await vscode.window.showQuickPick(items);
    if(!pick) {pick = 'default';}
    return {
        pick: pick,
        document:document,
        range: range,
    };
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