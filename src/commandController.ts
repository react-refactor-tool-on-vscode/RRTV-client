import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { ExtractParams } from './extension';

export type ExtractParamsBack = {
    name: string,
    range: vscode.Range,
    document: lc.DocumentUri
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

export async function stateUpgradeSelection(args:any): Promise<ExtractParamsBack> {
	const params = args as ExtractParams[];
    const items = params[0].items;
    let pick = await vscode.window.showQuickPick(items);
    let name = 'stateUpgrade'
    if (pick === undefined) {pick = 'default';}
    const paramsBack = {
        name: name,
        pick: pick,
        range: params[0].range,
        document: params[0].document
    };
    return paramsBack;
}