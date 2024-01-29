import { programs } from '../programs/programs.js';
import { Et3400 } from './modules/Et3400.js';
import { keypad } from './modules/keypad.js';

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
      if (!globalThis.et3400.powered) return;
      globalThis.et3400.pressKey(keyCode);
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
      if (!globalThis.et3400.powered) return;
      globalThis.et3400.releaseKey(keyCode);
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
    if (!globalThis.et3400.powered) return;
    // Prevent default action in case the active pagte is embedded
    event.preventDefault();
    // Handle the logic of a key press
    globalThis.et3400.pressKey(keyCode);
    window.setTimeout(() => globalThis.et3400.releaseKey(keyCode), 50);
  };
}

function registerListeners(document = globalThis.document) {
  const powerCycle = () => { globalThis.et3400.powerButton(); };
  // Register Listener on the Simulator Power Button
  document.querySelector('#Switch').addEventListener('mouseup', powerCycle);
  // Register Listeners on the Power Button
  const powerButtons = [...document.querySelectorAll('.power-button')];
  powerButtons[0].addEventListener('mouseup', powerCycle);
  powerButtons[1].addEventListener('mouseup', powerCycle);
  // Loop Through Keys on Keypad
  for (const property in keypad) {
    const keyData = keypad[property];
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
 *     Popout Window
 *  ================================================= */

function doPopout() {
  globalThis.popout = window.open('./popout.html', '_blank');
}

function onMessage(event) {
  const [action, operand] = event.data.split(':');
  if (action === 'releaseKey') {
    globalThis.et3400.releaseKey(operand);
  } else if (action === 'pressKey') {
    globalThis.et3400.pressKey(operand);
  } else if (action === 'sendDisplayData') {
    const currentDisplayHtml = document.querySelector('#plaintext-display').innerHTML;
    globalThis.popout.postMessage(`updateDisplay:${currentDisplayHtml}`, '*');
  }
}

/** =================================================
 *     Runtime
 *  ================================================= */
window.addEventListener('load', () => {
  window.addEventListener('message', onMessage, false);
  registerListeners();
  globalThis.et3400 = new Et3400();
  globalThis.et3400.powerOff();
  globalThis.loadHex = function(...args) {
    if (args.length === 1) {
      return globalThis.et3400.loadHex(0, args[0]);
    }
    return globalThis.et3400.loadHex(...args);
  };
  globalThis.programs = programs;
});
