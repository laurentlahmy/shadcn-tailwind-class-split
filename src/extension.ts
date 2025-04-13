// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "shadcn-tailwind-class-split" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('shadcn-tailwind-class-split.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from shadcn-tailwind-class-split!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.splitStringAddCommas', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selections = editor.selections;

            // Use editor.edit to make modifications bundleable for undo/redo
            editor.edit(editBuilder => {
                selections.forEach(selection => {
                    let textToTransform;
                    let rangeToReplace;

                    if (selection.isEmpty) {
                        // If no selection, use the whole line
                        const line = document.lineAt(selection.active.line);
                        textToTransform = line.text;
                        rangeToReplace = line.range; // Replace the entire line
                    } else {
                        // If there is a selection, use the selected text
                        textToTransform = document.getText(selection);
                        rangeToReplace = selection; // Replace only the selection
                    }

                    if (textToTransform) {
                        // 1. Trim whitespace from start/end
                        // 2. Split by one or more whitespace characters (\s+)
                        // 3. Filter out any empty strings resulting from multiple spaces
                        // 4. Wrap each part in double quotes
                        // 5. Join with ", "
                        const parts = textToTransform.trim().split(/\s+/).filter(part => part.length > 0);
                        const transformedText = parts.map(part => `"${part}"`).join(', ');

                        // Replace the original text (either line or selection) with the transformed text
                        editBuilder.replace(rangeToReplace, transformedText);
                    }
                });
            }).then(success => {
                if (!success) {
                    vscode.window.showErrorMessage('Failed to apply transformation.');
                }
                // Optional: Move cursor to end of the last replacement if multiple selections were involved
                // (For simplicity, we'll skip precise cursor management here)
            });
        } else {
            vscode.window.showInformationMessage('No active editor found.');
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};