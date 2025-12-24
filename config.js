/**
 * Configuration for Auto Accept Agent
 * 
 * TEMPORARY: Payment validation is disabled to unlock Pro features for everyone.
 * This is due to ongoing payment system issues causing backlash.
 * 
 * To re-enable payments:
 * 1. Uncomment the payment validation code below
 * 2. Set PRO_UNLOCKED_FOR_ALL to false
 */

// Pro features temporarily unlocked for everyone
const PRO_UNLOCKED_FOR_ALL = true;

// Payment validation settings (COMMENTED OUT - payment issues)
/*
const PAYMENT_CONFIG = {
    apiEndpoint: 'https://api.example.com/validate-license',
    licenseCheckInterval: 3600000, // 1 hour
    trialDays: 7,
    proFeatures: ['background-mode', 'multi-tab', 'overlay-ui']
};

async function validatePayment(licenseKey) {
    try {
        const response = await fetch(PAYMENT_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ licenseKey })
        });
        const data = await response.json();
        return data.valid === true;
    } catch (error) {
        console.error('Payment validation failed:', error);
        return false;
    }
}

function isProUser(context) {
    const licenseKey = context.globalState.get('licenseKey');
    if (!licenseKey) return false;
    return validatePayment(licenseKey);
}
*/

/**
 * Check if user has Pro access
 * TEMPORARY: Always returns true while payments are disabled
 * 
 * @param {object} context - VS Code extension context
 * @returns {boolean} - Always true while PRO_UNLOCKED_FOR_ALL is true
 */
function isProUser(context) {
    // TEMPORARY: Pro features unlocked for everyone
    if (PRO_UNLOCKED_FOR_ALL) {
        return true;
    }
    
    // TODO: Re-enable this when payment issues are resolved
    /*
    const licenseKey = context.globalState.get('licenseKey');
    if (!licenseKey) return false;
    return validatePayment(licenseKey);
    */
    
    return false;
}

/**
 * Check if a specific feature is available
 * TEMPORARY: All features are available while payments are disabled
 * 
 * @param {string} feature - Feature name to check
 * @param {object} context - VS Code extension context
 * @returns {boolean} - True if feature is available
 */
function hasFeature(feature, context) {
    // TEMPORARY: All features unlocked for everyone
    if (PRO_UNLOCKED_FOR_ALL) {
        return true;
    }
    
    // TODO: Re-enable feature gating when payment issues are resolved
    /*
    const proFeatures = ['background-mode', 'multi-tab', 'overlay-ui'];
    if (proFeatures.includes(feature)) {
        return isProUser(context);
    }
    */
    
    return true;
}

module.exports = {
    PRO_UNLOCKED_FOR_ALL,
    isProUser,
    hasFeature
};
