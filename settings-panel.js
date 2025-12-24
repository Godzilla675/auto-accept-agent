/**
 * Settings Panel for Auto Accept Agent
 * 
 * TEMPORARY: Payment-related UI is commented out due to payment system issues.
 * All Pro features are shown as unlocked.
 */

const vscode = require('vscode');
const config = require('./config');

/**
 * Create and show the settings panel
 * @param {vscode.ExtensionContext} context
 */
function showSettingsPanel(context) {
    const panel = vscode.window.createWebviewPanel(
        'autoAcceptSettings',
        'Auto Accept: Settings & Pro',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getWebviewContent(context);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'toggleBackgroundMode':
                    toggleBackgroundMode(context);
                    return;
                // PAYMENT MESSAGE HANDLERS - COMMENTED OUT
                /*
                case 'purchasePro':
                    handlePurchasePro(context);
                    return;
                case 'validateLicense':
                    validateLicense(context, message.licenseKey);
                    return;
                case 'removeLicense':
                    removeLicense(context);
                    return;
                */
            }
        },
        undefined,
        context.subscriptions
    );
}

/**
 * Toggle background mode
 * @param {vscode.ExtensionContext} context
 */
function toggleBackgroundMode(context) {
    const currentMode = context.globalState.get('backgroundMode', false);
    context.globalState.update('backgroundMode', !currentMode);
    vscode.window.showInformationMessage(
        `Background Mode: ${!currentMode ? 'ON' : 'OFF'}`
    );
}

// PAYMENT FUNCTIONS - COMMENTED OUT DUE TO PAYMENT ISSUES
/*
async function handlePurchasePro(context) {
    const purchaseUrl = 'https://example.com/purchase';
    vscode.env.openExternal(vscode.Uri.parse(purchaseUrl));
}

async function validateLicense(context, licenseKey) {
    try {
        const isValid = await config.validatePayment(licenseKey);
        if (isValid) {
            context.globalState.update('licenseKey', licenseKey);
            vscode.window.showInformationMessage('Pro license activated successfully!');
        } else {
            vscode.window.showErrorMessage('Invalid license key. Please check and try again.');
        }
    } catch (error) {
        vscode.window.showErrorMessage('Failed to validate license. Please try again later.');
    }
}

function removeLicense(context) {
    context.globalState.update('licenseKey', undefined);
    vscode.window.showInformationMessage('Pro license removed.');
}
*/

/**
 * Get webview HTML content
 * @param {vscode.ExtensionContext} context
 * @returns {string} HTML content
 */
function getWebviewContent(context) {
    const isPro = config.isProUser(context); // Always true while payments are disabled
    const backgroundMode = context.globalState.get('backgroundMode', false);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Auto Accept Settings</title>
            <style>
                :root {
                    --success-color: #4CAF50;
                    --warning-color: #ff9800;
                    --primary-color: #007ACC;
                }
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-foreground);
                    background: var(--vscode-editor-background);
                }
                h1, h2 { margin-bottom: 16px; }
                .notice {
                    background: #d4edda;
                    color: #155724;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid #c3e6cb;
                }
                .card {
                    background: var(--vscode-input-background);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 16px;
                    border: 1px solid var(--vscode-input-border);
                }
                .card h3 {
                    margin: 0 0 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .badge {
                    background: var(--success-color);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .badge.free {
                    background: var(--primary-color);
                }
                .toggle {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 12px;
                }
                button {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                .feature-list {
                    list-style: none;
                    padding: 0;
                }
                .feature-list li {
                    padding: 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .feature-list li::before {
                    content: "✓";
                    color: var(--success-color);
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>⚡ Auto Accept Agent</h1>
            
            <div class="notice">
                <strong>🎉 All Pro features are temporarily FREE!</strong><br>
                Due to payment system maintenance, we've unlocked all Pro features for everyone.
                Thank you for your patience!
            </div>

            <h2>Settings</h2>
            
            <div class="card">
                <h3>
                    Background Mode 
                    <span class="badge">Pro</span>
                    <span class="badge free">FREE</span>
                </h3>
                <p>Run automation across all conversations, even when unfocused.</p>
                <div class="toggle">
                    <span>Status: <strong>${backgroundMode ? 'Enabled' : 'Disabled'}</strong></span>
                    <button onclick="toggleBackground()">
                        ${backgroundMode ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>

            <h2>Pro Features (All Unlocked)</h2>
            
            <ul class="feature-list">
                <li>Background automation across all windows</li>
                <li>Multi-tab conversation tracking</li>
                <li>Real-time status overlay</li>
                <li>Tab cycling and management</li>
                <li>100% uptime - works even when minimized</li>
            </ul>

            <!-- PAYMENT SECTION - COMMENTED OUT DUE TO PAYMENT ISSUES
            <h2>Pro Subscription</h2>
            <div class="card">
                <h3>Upgrade to Pro</h3>
                <p>Get access to all premium features.</p>
                <button onclick="purchasePro()">Buy Pro - $9.99/month</button>
            </div>
            
            <div class="card">
                <h3>Already have a license?</h3>
                <input type="text" id="licenseKey" placeholder="Enter your license key" />
                <button onclick="validateLicense()">Activate</button>
            </div>
            -->

            <script>
                const vscode = acquireVsCodeApi();
                
                function toggleBackground() {
                    vscode.postMessage({ command: 'toggleBackgroundMode' });
                    // Refresh page after toggle
                    setTimeout(() => location.reload(), 100);
                }

                // PAYMENT FUNCTIONS - COMMENTED OUT
                /*
                function purchasePro() {
                    vscode.postMessage({ command: 'purchasePro' });
                }
                
                function validateLicense() {
                    const key = document.getElementById('licenseKey').value;
                    vscode.postMessage({ command: 'validateLicense', licenseKey: key });
                }
                */
            </script>
        </body>
        </html>
    `;
}

module.exports = {
    showSettingsPanel
};
