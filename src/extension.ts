// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";
import * as configRaw from './config.json';
import {Config} from "./config";
import * as lc from 'vscode-languageclient/node';
import { 
	CodeActionAndHover
} from './hover_codeaction';

let client: lc.LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(ctx: vscode.ExtensionContext) {
	let config:Config = configRaw as Config;
	console.log("config: ", config);
	setServer(ctx);
	await createClient(ctx, config);
	
}

function setServer(ctx: vscode.ExtensionContext): vscode.ExtensionContext {
	let hoverAction = new CodeActionAndHover;
	ctx.subscriptions.push(
		vscode.languages.registerHoverProvider(
			{ scheme: 'file', language: 'javascript' },
			hoverAction
		)
	);
	ctx.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			{ scheme: 'file', language: 'javascript' },
			hoverAction
		)
	);

	return ctx;
}

function createClient(ctx: vscode.ExtensionContext, config: Config): Promise<lc.LanguageClient> {
	const serverModule = ctx.asAbsolutePath(config.serverPath);
	const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	const serverOptions: lc.ServerOptions = {
		run: { module: serverModule, transport: lc.TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: lc.TransportKind.ipc,
		}
	};
	const clientOptions: lc.LanguageClientOptions = {
		documentSelector: [
			{scheme: 'file', language: 'javascript' },
			{scheme: 'file', language: 'javascriptreact' },
			{scheme: 'file', language: 'typescript' },
			{scheme: 'file', language: 'typescriptreact'},
			{scheme: 'file', language: 'json'},
			{scheme: 'file', language: 'plaintext'},
	],
		synchronize: {
			configurationSection: 'languageServerExample',
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};
	client = new lc.LanguageClient(
		'rrtv-server',
		'RRTV-server',
		serverOptions,
		clientOptions
	);
	if(client) {
		console.log("client created");
		client.start().catch(err => console.error(err));
	} else {
		console.log("client not created");
	}
	return Promise.resolve(client);
}


// This method is called when your extension is deactivated
export function deactivate() {
	if(!client) {
		return undefined;
	}
	return client.stop();
}
