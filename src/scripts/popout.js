const hostWindow = window.opener;

globalThis.KEYPAD = {
    DO: {
        selector: '#button-do',
        hexCode: 0x0D,
        keyboardActivation: 'D'
    },
    EXAM: {
        selector: '#button-exam',
        hexCode: 0x0E,
        keyboardActivation: 'E'
    },
    FWD:  {
        selector: '#button-fwd',
        hexCode: 0x0F,
        keyboardActivation: 'F'
    },
    AUTO: {
        selector: '#button-auto',
        hexCode: 0x0A,
        keyboardActivation: 'A'
    },
    BACK: {
        selector: '#button-back',
        hexCode: 0x0B,
        keyboardActivation: 'B'
    },
    CHAN: {
        selector: '#button-chan',
        hexCode: 0x0C,
        keyboardActivation: 'C'
    },
    RTI: {
        selector: '#button-rti',
        hexCode: 0x07,
        keyboardActivation: '7'
    },
    SS: {
        selector: '#button-ss',
        hexCode: 0x08,
        keyboardActivation: '8'
    },
    BR: {
        selector: '#button-br',
        hexCode: 0x09,
        keyboardActivation: '9'
    },
    INDEX: {
        selector: '#button-index',
        hexCode: 0x04,
        keyboardActivation: '4'
    },
    CC: {
        selector: '#button-cc',
        hexCode: 0x05,
        keyboardActivation: '5'
    },
    SP: {
        selector: '#button-sp',
        hexCode: 0x06,
        keyboardActivation: '6'
    },
    ACCA: {
        selector: '#button-acca',
        hexCode: 0x01,
        keyboardActivation: '1'
    },
    ACCB: {
        selector: '#button-accb',
        hexCode: 0x02,
        keyboardActivation: '2'
    },
    PC: {
        selector: '#button-pc',
        hexCode: 0x03,
        keyboardActivation: '3'
    },
    ZERO: {
        selector:  '#button-zero',
        hexCode: 0x00,
        keyboardActivation: '0'
    },
    RESET: {
        selector: '#button-reset',
        hexCode: 0x10,
        keyboardActivation: 'ESCAPE'
    }
};

function makeKeyDownListener(keyData) {
    const {hexCode, keyboardActivation} = keyData;
    return function(event) {
        event.preventDefault();
        if (event.key.toUpperCase() === keyboardActivation) {
            // Inform Parent Window of the Key Press
            hostWindow.postMessage(`pressKey:${hexCode}`, window.location.origin);
        }
    };
}

function makeKeyUpListener(keyData) {
    const {hexCode, keyboardActivation} = keyData;
    return function(event) {
        event.preventDefault();
        if (event.key.toUpperCase() === keyboardActivation) {
            // Inform Parent Window of the Key Release
            hostWindow.postMessage(`releaseKey:${hexCode}`, window.location.origin);
        }
    };
}

function makeMouseDownListener(keyData) {
    const {hexCode} = keyData;
    return function() {
    // Prevent default action in case the active page is embedded
        event.preventDefault();
        // Inform Parent Window of the Key Press
        hostWindow.postMessage(`pressKey:${hexCode}`, window.location.origin);
    };
}

function makeMouseUpListener(keyData) {
    const {hexCode} = keyData;
    return function() {
    // Prevent default action in case the active page is embedded
        event.preventDefault();
        // Inform Parent Window of the Key Release
        hostWindow.postMessage(`releaseKey:${hexCode}`, window.location.origin);
    };
}

function onMessage(event) {
    // Only accept messages from the same-origin simulator window that opened this pop-out
    if (event.origin !== window.location.origin || event.source !== hostWindow) {
        return;
    }
    const [action, operand] = event.data.split(':');
    if (action === 'updateDisplay') {
        // Build the display from text nodes; only <b> and </b> become (lit segment) elements
        const display = document.querySelector('#plaintext-display');
        display.textContent = '';
        let parent = display;
        for (const part of operand.split(/(<\/?b>)/)) {
            if (part === '<b>') {
                parent = display.appendChild(document.createElement('b'));
            } else if (part === '</b>') {
                parent = display;
            } else {
                parent.append(part);
            }
        }
    }
}

function registerListeners(document = globalThis.document) {
    // Loop Through Keys on Keypad
    for (const property in globalThis.KEYPAD) {
        const keyData = globalThis.KEYPAD[property];
        // Register keyboard listeners on the document
        const element = document.querySelector(keyData.selector);
        document.addEventListener('keydown', makeKeyDownListener(keyData));
        document.addEventListener('keyup', makeKeyUpListener(keyData));
        // Register click listeners on the keypad
        element.addEventListener('mousedown', makeMouseDownListener(keyData));
        element.addEventListener('mouseup', makeMouseUpListener(keyData));
    }
    window.addEventListener('message', onMessage, false);
}

function requestDisplayHtml() {
    hostWindow.postMessage('sendDisplayData', window.location.origin);
}

window.addEventListener('load', () => {
    requestDisplayHtml();
    registerListeners();
});
