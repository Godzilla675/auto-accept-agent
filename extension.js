/**
 * Auto Accept Agent - VS Code Extension
 * 
 * TEMPORARY: Payment validation is disabled to unlock Pro features for everyone.
 * This is due to ongoing payment system issues.
 */

const vscode = require('vscode');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Get version from package.json safely at module load time
const packageInfo = require('./package.json');
const EXTENSION_VERSION = packageInfo.version;

let statusBarItem;
let isRunning = false;
let cdpSocket = null;

/**
 * Activate the extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Auto Accept Agent is now active');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'auto-accept.toggle';
    updateStatusBar();
    statusBarItem.show();

    // Register commands
    const toggleCommand = vscode.commands.registerCommand('auto-accept.toggle', () => {
        toggleAutoAccept(context);
    });

    const toggleBackgroundCommand = vscode.commands.registerCommand('auto-accept.toggleBackground', () => {
        toggleBackgroundMode(context);
    });

    const openSettingsCommand = vscode.commands.registerCommand('auto-accept.openSettings', () => {
        openSettingsPanel(context);
    });

    context.subscriptions.push(toggleCommand, toggleBackgroundCommand, openSettingsCommand, statusBarItem);

    // Auto-start if configured
    const autoStart = vscode.workspace.getConfiguration('autoAccept').get('autoStart', true);
    if (autoStart) {
        isRunning = true;
        updateStatusBar();
        initializeCDPConnection(context);
    }
}

/**
 * Toggle auto-accept on/off
 * @param {vscode.ExtensionContext} context
 */
function toggleAutoAccept(context) {
    isRunning = !isRunning;
    updateStatusBar();

    if (isRunning) {
        initializeCDPConnection(context);
        vscode.window.showInformationMessage('Auto Accept: ON');
    } else {
        closeCDPConnection();
        vscode.window.showInformationMessage('Auto Accept: OFF');
    }
}

/**
 * Toggle background mode (Pro feature - currently unlocked for all)
 * @param {vscode.ExtensionContext} context
 */
function toggleBackgroundMode(context) {
    // TEMPORARY: Pro features unlocked for everyone
    // Payment validation disabled due to payment issues
    /*
    if (!config.isProUser(context)) {
        vscode.window.showWarningMessage('Background mode is a Pro feature. Upgrade to unlock.');
        return;
    }
    */

    const currentMode = context.globalState.get('backgroundMode', false);
    context.globalState.update('backgroundMode', !currentMode);
    
    if (!currentMode) {
        vscode.window.showInformationMessage('Background Mode: ON (Pro feature - temporarily free)');
    } else {
        vscode.window.showInformationMessage('Background Mode: OFF');
    }
}

/**
 * Open settings panel (Pro features unlocked)
 * @param {vscode.ExtensionContext} context
 */
function openSettingsPanel(context) {
    // TEMPORARY: Show all Pro features as available
    // Payment-related settings are hidden while payments are disabled
    
    const panel = vscode.window.createWebviewPanel(
        'autoAcceptSettings',
        'Auto Accept Settings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    // TEMPORARY: All features shown as unlocked
    panel.webview.html = getSettingsHTML(context);
}

/**
 * Get settings panel HTML
 * @param {vscode.ExtensionContext} context
 * @returns {string} HTML content
 */
function getSettingsHTML(context) {
    const isPro = config.isProUser(context); // Will always be true while PRO_UNLOCKED_FOR_ALL is true
    
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Auto Accept Settings</title>
            <style>
                body { font-family: var(--vscode-font-family); padding: 20px; }
                .feature { margin: 10px 0; padding: 10px; background: var(--vscode-editor-background); border-radius: 5px; }
                .feature.pro { border-left: 3px solid #4CAF50; }
                .status { color: #4CAF50; font-weight: bold; }
                .notice { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Auto Accept Agent Settings</h1>
            
            <div class="notice">
                <strong>🎉 All Pro features are temporarily free!</strong><br>
                Due to payment system maintenance, all Pro features are unlocked for everyone.
            </div>

            <h2>Features</h2>
            
            <div class="feature pro">
                <h3>Background Mode ✓</h3>
                <p>Execute agent tasks in all conversations continuously.</p>
                <span class="status">Available</span>
            </div>
            
            <div class="feature pro">
                <h3>Multi-Tab Support ✓</h3>
                <p>Track and manage multiple conversation tabs simultaneously.</p>
                <span class="status">Available</span>
            </div>
            
            <div class="feature pro">
                <h3>Overlay UI ✓</h3>
                <p>Visual overlay showing status of all active conversations.</p>
                <span class="status">Available</span>
            </div>

            <!-- PAYMENT SECTION - COMMENTED OUT DUE TO PAYMENT ISSUES
            <h2>Pro Subscription</h2>
            <div class="feature">
                <h3>Upgrade to Pro</h3>
                <p>Unlock all Pro features with a subscription.</p>
                <button onclick="purchasePro()">Upgrade Now</button>
            </div>
            -->

            <footer style="margin-top: 30px; color: var(--vscode-descriptionForeground);">
                <p>Auto Accept Agent v${EXTENSION_VERSION}</p>
            </footer>
        </body>
        </html>
    `;
}

/**
 * Update status bar appearance
 */
function updateStatusBar() {
    if (isRunning) {
        statusBarItem.text = '$(check) Auto-Accept: ON';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '$(x) Auto-Accept: OFF';
        statusBarItem.backgroundColor = undefined;
    }
}

/**
 * Initialize CDP (Chrome DevTools Protocol) connection
 * @param {vscode.ExtensionContext} context
 */
function initializeCDPConnection(context) {
    // This would connect to the IDE's DevTools Protocol
    // For now, we'll implement a polling-based approach
    
    const backgroundMode = context.globalState.get('backgroundMode', false);
    
    if (backgroundMode && config.hasFeature('background-mode', context)) {
        startBackgroundPolling(context);
    } else {
        startSimplePolling(context);
    }
}

/**
 * Start simple polling mode
 * @param {vscode.ExtensionContext} context
 */
function startSimplePolling(context) {
    // Polling implementation would go here
    console.log('Simple polling mode started');
}

/**
 * Start background polling mode (Pro feature - unlocked)
 * @param {vscode.ExtensionContext} context
 */
function startBackgroundPolling(context) {
    // TEMPORARY: No pro check needed while payments are disabled
    /*
    if (!config.isProUser(context)) {
        vscode.window.showWarningMessage('Background mode requires Pro. Starting simple mode instead.');
        startSimplePolling(context);
        return;
    }
    */
    
    console.log('Background polling mode started (Pro feature - temporarily free)');
}

/**
 * Close CDP connection
 */
function closeCDPConnection() {
    if (cdpSocket) {
        cdpSocket.close();
        cdpSocket = null;
    }
}

/**
 * Deactivate the extension
 */
function deactivate() {
    closeCDPConnection();
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
