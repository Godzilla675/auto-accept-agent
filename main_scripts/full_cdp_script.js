/**
 * CDP Injected Script for Auto Accept Agent
 * Runs in the IDE's browser context (renderer process)
 * 
 * TEMPORARY: Pro feature checks are disabled. All features are available.
 */

(function() {
    'use strict';

    // Global state
    const GlobalState = {
        isRunning: false,
        sessionID: 0,
        tabNames: [],
        completedTabs: new Set(),
        mode: 'simple', // 'simple' or 'background'
        // TEMPORARY: Pro features unlocked for everyone
        isPro: true // Previously checked via license validation
    };

    // Selectors for different IDEs
    const SELECTORS = {
        cursor: {
            panel: '#workbench\\.parts\\.auxiliarybar',
            tabs: '#workbench\\.parts\\.auxiliarybar .tab',
            buttons: 'button, .ah-button'
        },
        antigravity: {
            panel: '#antigravity\\.agentPanel',
            tabs: '.agent-tab',
            buttons: 'button.accept, button.confirm'
        }
    };

    // Detect IDE type
    function detectIDE() {
        if (document.querySelector(SELECTORS.antigravity.panel)) {
            return 'antigravity';
        }
        return 'cursor';
    }

    // Deduplicate tab names by appending (2), (3), etc.
    function deduplicateNames(names) {
        const counts = {};
        return names.map(name => {
            if (!counts[name]) {
                counts[name] = 1;
                return name;
            } else {
                counts[name]++;
                return `${name} (${counts[name]})`;
            }
        });
    }

    // Extract tab name and strip time suffix
    function extractTabName(tabElement) {
        const text = tabElement.textContent || '';
        // Strip time patterns like "12:34" or "12:34:56"
        return text.replace(/\d{1,2}:\d{2}(:\d{2})?/g, '').trim();
    }

    // Check if a button is an accept/confirm button
    function isAcceptButton(button) {
        const text = (button.textContent || '').toLowerCase();
        const acceptPatterns = ['accept', 'confirm', 'yes', 'allow', 'proceed', 'continue'];
        return acceptPatterns.some(pattern => text.includes(pattern));
    }

    // Dispatch click event
    function dispatchClick(element) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    // Find elements safely
    function findElements(selector) {
        try {
            return Array.from(document.querySelectorAll(selector));
        } catch (e) {
            return [];
        }
    }

    // Main polling loop for Cursor IDE
    function runCursorLoop() {
        if (!GlobalState.isRunning) return;

        const ide = 'cursor';
        const selectors = SELECTORS[ide];

        // 1. Interaction Phase - Click accept buttons
        const buttons = findElements(selectors.buttons);
        buttons.forEach(btn => {
            if (isAcceptButton(btn)) {
                dispatchClick(btn);
            }
        });

        // 2. Tab Management Phase (Pro feature - now available to all)
        // TEMPORARY: No pro check needed
        /*
        if (!GlobalState.isPro) {
            // Free tier: Skip tab management
            setTimeout(runCursorLoop, 3000);
            return;
        }
        */

        const tabs = findElements(selectors.tabs);
        const rawNames = tabs.map(extractTabName);
        GlobalState.tabNames = deduplicateNames(rawNames);

        // Cycle to next tab to keep process alive
        cycleNextTab();

        // 3. UI Phase - Update overlay
        updateOverlay();

        // Continue polling
        setTimeout(runCursorLoop, 3000);
    }

    // Main polling loop for Antigravity IDE
    function runAntigravityLoop() {
        if (!GlobalState.isRunning) return;

        const ide = 'antigravity';
        const selectors = SELECTORS[ide];

        // Click accept buttons
        const buttons = findElements(selectors.buttons);
        buttons.forEach(btn => {
            if (isAcceptButton(btn)) {
                dispatchClick(btn);
            }
        });

        // Tab management (Pro feature - now available to all)
        const tabs = findElements(selectors.tabs);
        const rawNames = tabs.map(extractTabName);
        GlobalState.tabNames = deduplicateNames(rawNames);

        updateOverlay();
        setTimeout(runAntigravityLoop, 3000);
    }

    // Simple polling loop (works for all users)
    function runSimplePollLoop() {
        if (!GlobalState.isRunning) return;

        // Just click accept buttons
        const allButtons = findElements('button');
        allButtons.forEach(btn => {
            if (isAcceptButton(btn)) {
                dispatchClick(btn);
            }
        });

        setTimeout(runSimplePollLoop, 3000);
    }

    // Cycle to next tab
    function cycleNextTab() {
        // Implementation depends on IDE internals
        // This keeps the automation process alive
    }

    // Create or update the overlay UI (Pro feature - now available to all)
    function updateOverlay() {
        // TEMPORARY: No pro check needed - overlay available to everyone
        /*
        if (!GlobalState.isPro) {
            return; // Free tier doesn't get overlay
        }
        */

        let overlay = document.getElementById('__autoAcceptBgOverlay');
        
        // Phase 1: Create overlay if it doesn't exist
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = '__autoAcceptBgOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 8px;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 12px;
                max-width: 200px;
            `;
            document.body.appendChild(overlay);
        }

        // Phase 2: Update content using pure DOM manipulation (CSP-compliant)
        overlay.innerHTML = ''; // Clear existing content

        const header = document.createElement('div');
        header.textContent = `Auto Accept: ${GlobalState.isRunning ? 'ON' : 'OFF'}`;
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '8px';
        overlay.appendChild(header);

        // Show tab statuses
        GlobalState.tabNames.forEach(name => {
            const slot = document.createElement('div');
            slot.style.cssText = 'padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.2);';
            
            const isCompleted = GlobalState.completedTabs.has(name);
            const status = isCompleted ? 'DONE' : 'WORKING';
            const color = isCompleted ? '#4CAF50' : '#9C27B0';
            
            // Use textContent to prevent XSS from tab names
            const indicator = document.createElement('span');
            indicator.style.color = color;
            indicator.textContent = '●';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            
            const statusSpan = document.createElement('span');
            statusSpan.style.cssText = `float: right; color: ${color};`;
            statusSpan.textContent = status;
            
            slot.appendChild(indicator);
            slot.appendChild(nameSpan);
            slot.appendChild(statusSpan);
            overlay.appendChild(slot);
        });
    }

    // Start the agent
    function startAgent(config = {}) {
        GlobalState.isRunning = true;
        GlobalState.sessionID = Date.now();
        GlobalState.mode = config.mode || 'simple';
        // TEMPORARY: Pro is always true while payments are disabled
        GlobalState.isPro = true; // config.isPro || false;

        const ide = detectIDE();

        if (GlobalState.mode === 'background') {
            // Background mode (Pro feature - now available to all)
            if (ide === 'cursor') {
                runCursorLoop();
            } else {
                runAntigravityLoop();
            }
        } else {
            runSimplePollLoop();
        }
    }

    // Stop the agent
    function stopAgent() {
        GlobalState.isRunning = false;
        
        // Remove overlay
        const overlay = document.getElementById('__autoAcceptBgOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Expose API
    window.__autoAcceptAgent = {
        start: startAgent,
        stop: stopAgent,
        getState: () => ({ ...GlobalState }),
        // TEMPORARY: These payment methods are disabled
        /*
        isPro: () => GlobalState.isPro,
        setPro: (value) => { GlobalState.isPro = value; }
        */
    };

})();
