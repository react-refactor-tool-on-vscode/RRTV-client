import * as vscode from 'vscode';

export class CodeActionAndHover implements vscode.CodeActionProvider, vscode.HoverProvider {

    word: string;
    isFunction: boolean;
    position: vscode.Position;
    wordRange: vscode.Range;
    constructor() {
        this.word = "";
        this.isFunction = false;
        this.position = new vscode.Position(0, 0);
        this.wordRange = new vscode.Range(this.position, this.position);
    }
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position);
        if(wordRange !== undefined) {
            this.wordRange = wordRange;
        }
        this.position = position;
        this.word = document.getText(wordRange);
        const hover = new vscode.Hover("hover: " + this.word);
        const pattern = /\bfunction\b/g;
	    let m: RegExpExecArray | null;
        const textLine = document.lineAt(position.line);
        if(m = pattern.exec(textLine.text)) {
            this.isFunction = true;
        }
        return hover;
    }
    
    provideCodeActions(
        document: vscode.TextDocument, 
        range: vscode.Range, 
        ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
            const position = range.start;
            console.log("provider is running");
            const selectedText = document.getText(range);
            const codeActions: vscode.CodeAction[] = [];
            // 如果选中的文本不为空，则创建 Code Action
            if (selectedText.trim() !== '') {
                // 创建 Code Action 对象
                const actionToUpper = new vscode.CodeAction(`Convert '${selectedText}' to upper case`, vscode.CodeActionKind.QuickFix);
                const actionTextAdd = new vscode.CodeAction("Add Hello,world!",vscode.CodeActionKind.QuickFix);
                const position = new vscode.Position(range.start.line, 0);
                const textEdit = new vscode.TextEdit(new vscode.Range(position, position), 'Hello,world!');
                
    
                actionToUpper.edit = new vscode.WorkspaceEdit();
                actionTextAdd.edit = new vscode.WorkspaceEdit();
                actionTextAdd.edit.set(document.uri, [textEdit]);
                actionToUpper.edit.replace(document.uri, range, selectedText.toUpperCase());
                codeActions.push(actionTextAdd);
                codeActions.push(actionTextAdd);
                // 将 Code Action 返回

                
            }
            if(this.isFunction) {
               
                const codeAction = new vscode.CodeAction("dublicate this element", vscode.CodeActionKind.Refactor);
                const position = this.position;
                codeAction.command = {
                    command: 'extension.refactorFunction',
                    title: 'Refactor Function',
                    arguments: [document.uri, this.wordRange] 
                };
                codeAction.edit = new vscode.WorkspaceEdit;
                codeAction.edit.replace(document.uri, this.wordRange, "refactor-recommendation");
                codeActions.push(codeAction);
                this.isFunction = false;
            }
            if(codeActions.length > 0) {return codeActions;}
        }
}