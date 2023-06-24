import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { extractParams } from './extension';

export type ExtractParamsBack = {
    name: string,
    range: vscode.Range,
    document: lc.DocumentUri
};

export async function extractSelection(args:any): Promise<ExtractParamsBack> {
	const params = args as extractParams[];
    const items = params[0].items;
    items.push('input a new name');
    let pick = await vscode.window.showQuickPick(items);
    if(pick === 'input a new name') {
        pick = await vscode.window.showInputBox();
    } 
    if (pick === undefined) {pick = 'default'};
    const paramsBack = {
        name: pick,
        range: params[0].range,
        document: params[0].document
    };
    return paramsBack;

}