import { Et3400 } from './modules/Et3400.js';

class PrintableProgramLine {
  constructor(address, opCode, operand, label, mnemonicInstruction, mnemonicOperand, comment = '') {
  
  }
}

class Memory {

  constructor(size = 0xFFFF, contentArray = new Array(size).fill(0)) {
    this.content = contentArray;
  }

  clear() {
    this.content.fill(0);
  }

  readByte(address) {
    return this.content[address];
  }

  writeByte(address, content) {
    this.content[address] = content;
  }
}

class ReadOnlyMemory extends Memory {
  constructor(size = 0xFFFF, contentArray = new Array(size).fill(0)) {
    const sizeDifference = contentArray.length - size;
    if (sizeDifference > 0) {
      contentArray = contentArray.slice(0, sizeDifference);
      console.warn(`ROM content truncated to ${size} bytes`);
    } else if (sizeDifference < 0) {
      contentArray = contentArray.concat(new Array(-sizeDifference).fill(0));
    }
    super();
    this.content = contentArray;
  }

  clear() {
    console.warn('Attempt to clear ROM, Nothing cleared');
  }

  writeByte(address, content) {
    console.warn(`Attempt to write to ROM at address ${address.toString(16).toUpperCase()}, Nothing written`);
  }
}

class RandomAccessMemory extends Memory {
  
}

function EXIT(string) {
  alert(`${string} @ Program Counter ${et3400.microprocessor.programCounter.toString(16)}`);
  throw new Error(string);
}

function hex2binary(string) {
  const length = string.length;
  let returnValue = '';
  for (let index = 0; index < length; ++index) {
    returnValue += String.fromCharCode(parseInt(string.substr(index++, 2), 16));
  }
  return returnValue;
}

function loadProgramHex(address, string) {
  et3400.microprocessor.programCounter = address;
  const length = string.length;
  for (let index = 0; index < length; index += 2) {
    const byteString = `${string[index]}${string[index + 1]}`;
    const decimal = parseInt(byteString, 16);
    et3400.microprocessor.SMB(decimal);
  }
}

/** =================================================
 *     Debugging & Information
 *  ================================================= */
function logKeyBindings() {
  console.log(`Default Key Bindings
  
Trainer     Function,
  Key       Physical Key
  
┌─────┐      [No Function]
│     │      ┌───┐
│  0  │ ───→ │ 0 │
└─────┘      └───┘
┌─────┐      Reset the CPU
│RESET│      ┌─────┐
│     │ ───→ │ ESC │
└─────┘      └─────┘
┌─────┐      View contents of Accumulator A Register
│ACCA │      ┌───┐
│  1  │ ───→ │ 1 │
└─────┘      └───┘
┌─────┐      View contents of Accumulator B Register
│ACCB │      ┌───┐
│  2  │ ───→ │ 2 │
└─────┘      └───┘
┌─────┐      View contents of Program Counter Register
│ PC  │      ┌───┐
│  3  │ ───→ │ 3 │
└─────┘      └───┘
┌─────┐      View contents of Index Pointer Register
│INDEX│      ┌───┐
│  4  │ ───→ │ 4 │
└─────┘      └───┘
┌─────┐      View contents of Condition Codes Register
│ CC  │      ┌───┐
│  5  │ ───→ │ 5 │
└─────┘      └───┘
┌─────┐      View contents of Stack Pointer Register
│ SP  │      ┌───┐
│  6  │ ───→ │ 6 │
└─────┘      └───┘
┌─────┐      Return from Interrupt
│ RTI │      ┌───┐
│  7  │ ───→ │ 7 │
└─────┘      └───┘
┌─────┐      Single Step
│ SS  │      ┌───┐
│  8  │ ───→ │ 8 │
└─────┘      └───┘
┌─────┐      Break
│ BR  │      ┌───┐
│  9  │ ───→ │ 9 │
└─────┘      └───┘
┌─────┐      Start entering hex at specified address
│AUTO │      ┌───┐
│  A  │ ───→ │ A │
└─────┘      └───┘
┌─────┐      During Examine mode, move address back
│BACK │      ┌───┐
│  B  │ ───→ │ B │
└─────┘      └───┘
┌─────┐      Exam Mode: edit hex at specified address; Else: edit hex in selected register
│CHAN │      ┌───┐
│  C  │ ───→ │ C │
└─────┘      └───┘
┌─────┐      Execute RAM at given address
│ DO  │      ┌───┐
│  D  │ ───→ │ D │
└─────┘      └───┘
┌─────┐      Start viewing hex at specified address
│EXAM │      ┌───┐
│  E  │ ───→ │ E │
└─────┘      └───┘
┌─────┐      During Examine mode, move address forward
│ FWD │      ┌───┐
│  F  │ ───→ │ F │
└─────┘      └───┘`);
}


/** =================================================
 *     Event Listeners
 *  ================================================= */
function makeKeyDownListener(keyData) {
  const {simulator, keyCode, keyboardActivation} = keyData;
  const element = document.querySelector(simulator);
  return function(event) {
    event.preventDefault();
    if (event.key.toUpperCase() === keyboardActivation) {
      animateKeyDown(element);
      if (!et3400.powered) return;
      et3400.pressKey(keyCode);
    }
  };
}

function makeKeyUpListener(keyData) {
  const {simulator, keyCode, keyboardActivation} = keyData;
  const element = document.querySelector(simulator);
  return function(event) {
    event.preventDefault();
    if (event.key.toUpperCase() === keyboardActivation) {
      animateKeyUp(element);
      if (!et3400.powered) return;
      et3400.releaseKey(keyCode);
    }
  };
}

function makeClickListener(keyData) {
  const {simulator, keyCode} = keyData;
  const element = document.querySelector(simulator);
  return function() {
    // Animate the key press
    animateKeyDown(element);
    window.setTimeout(() => animateKeyUp(element), 100);
    // If there's no power, do nothing
    if (!et3400.powered) return;
    // Prevent default action in case the active pagte is embedded
    event.preventDefault();
    // Handle the logic of a key press
    et3400.pressKey(keyCode);
    window.setTimeout(() => et3400.releaseKey(keyCode), 50);
  };
}

function doPopout() {
  globalThis.popout = window.open('./popout.html', '_blank');
}

function onMessage(event) {
  const [action, operand] = event.data.split(':');
  if (action === 'releaseKey') {
    et3400.releaseKey(operand);
  } else if (action === 'pressKey') {
    et3400.pressKey(operand)
  } else if (action === 'sendDisplayData') {
    const currentDisplayHtml = document.querySelector('#plaintext-display').innerHTML;
    globalThis.popout.postMessage(`updateDisplay:${currentDisplayHtml}`, '*');
  }
}

function registerListeners(document = globalThis.document) {
  // Register Listener on the Simulator Power Button
  document.querySelector('#Switch').addEventListener('mouseup', () => { et3400.powerButton() });
  // Register Listeners on the Power Button
  const powerButtons = [...document.querySelectorAll('.power-button')];
  powerButtons[0].addEventListener('mouseup', () => { et3400.powerButton() });
  powerButtons[1].addEventListener('mouseup', () => { et3400.powerButton() });
  // Loop Through Keys on Keypad
  for (const property in Et3400.keypad) {
    const keyData = Et3400.keypad[property];
    // Register keyboard listeners on the document
    const element = document.querySelector(keyData.selector);
    const keyUpDownAbortController = new AbortController();
    keyData.abortControllers.keyUpDown = keyUpDownAbortController;
    document.addEventListener('keydown', makeKeyDownListener(keyData), { keyUpDownAbortController });
    document.addEventListener('keyup', makeKeyUpListener(keyData), { keyUpDownAbortController });
    // Register click listeners on the keypad
    element.addEventListener('click', makeClickListener(keyData));
    // Register click listeners on the Simulator
    const simulatorElement = document.querySelector(keyData.simulator);
    const clickAbortController = new AbortController();
    keyData.abortControllers.click = clickAbortController;
    simulatorElement.addEventListener('click', makeClickListener(keyData), { clickAbortController });
  }
  // Popout Window
  document.querySelector('#button-popout').addEventListener('click', doPopout);
}

/** =================================================
 *     Animation
 *  ================================================= */
function animateKeyDown(element) {
  const boundingBox = element.getBBox();
  const x = boundingBox.x;
  const xCenter = boundingBox.width / 2;
  const y = boundingBox.y;
  const yCenter = boundingBox.height / 2;
  element.setAttribute('transform', `translate(${xCenter + x},${yCenter + y}) scale(0.925, 0.925) translate(${-xCenter - x},${-yCenter- y})`);
}

function animateKeyUp(element) {
  element.setAttribute('transform', '');
}

/** =================================================
 *     Runtime
 *  ================================================= */
window.addEventListener('load', () => {
  globalThis.segmentDisplays = [
    document.querySelector('#display-h'),
    document.querySelector('#display-i'),
    document.querySelector('#display-n'),
    document.querySelector('#display-z'),
    document.querySelector('#display-v'),
    document.querySelector('#display-c')
  ];
  window.addEventListener('message', onMessage, false);
  registerListeners();
  globalThis.et3400 = new Et3400();
  et3400.powerOff();
});
