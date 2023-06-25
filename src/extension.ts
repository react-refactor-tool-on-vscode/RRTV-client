// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";
import * as configRaw from './config.json';
import { Config } from "./config";
import { extractSelection, getAttrSelection } from './commandController';
import * as lc from 'vscode-languageclient/node';
import { TabPosition, multiCursor } from './multicursor';

export let client: lc.LanguageClient;

export type ExtractParams = {
	items: string[],
	range: vscode.Range,
	document: lc.DocumentUri
};


export async function activate(ctx: vscode.ExtensionContext) {
	let config: Config = configRaw as Config;
	console.log("config: ", config);
	setServer(ctx);
	await createClient(ctx, config);
}

function setServer(ctx: vscode.ExtensionContext): vscode.ExtensionContext {
	ctx.subscriptions.push();
	return ctx;
}

const docSelector = [
	{ scheme: 'file', language: 'javascript' },
	{ scheme: 'file', language: 'javascriptreact' },
	{ scheme: 'file', language: 'typescript' },
	{ scheme: 'file', language: 'typescriptreact' },
	{ scheme: 'file', language: 'json' },
	{ scheme: 'file', language: 'plaintext' },
];

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
		documentSelector: docSelector,
		synchronize: {
			configurationSection: 'languageServerExample',
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		},
		middleware: {
			executeCommand: async (commands, args, next) => {
				if (commands === 'extract') {
					const paramsBack = await extractSelection(args);
					next('extract-server', [paramsBack]);
					return;
				} else if (commands === 'provide attribute') {
					const paramsBack = await getAttrSelection(args);
					next('provide attribute exec', [paramsBack]);
					return;
				} else if (commands === 'run snippet') {
					const tabpos:TabPosition[] = args[0];
					multiCursor(tabpos);
					return;
				}
				next(commands, args);
			}
		}
	};
	client = new lc.LanguageClient(
		'rrtv-server',
		'rrtv-server',
		serverOptions,
		clientOptions
	);
	if (client) {
		console.log("client created");
		client.start().catch(err => console.error(err));
	} else {
		console.log("client not created");
	}
	return Promise.resolve(client);
}


export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
