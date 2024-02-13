import { Microprocessor } from './Microprocessor.js';
import { contstructAddressingMethodTable } from './addressingMethods.js';
import { padByteBinary, padWordHex } from './util.js';
import { ROM } from '../../programs/heathkit/rom.js';
import { Memory } from './Memory.js';


/**
 * Converts a hexadecimal string to binary.
 * 
 * @param {string} string - The hexadecimal string to convert.
 * @returns {string} The binary representation of the hexadecimal string.
 */
function hex2binary(string) {
  const length = string.length;
  let returnValue = '';
  for (let index = 0; index < length; ++index) {
    returnValue += String.fromCharCode(parseInt(string.substr(index++, 2), 16));
  }
  return returnValue;
}

/**
 * Represents the ET-3400 microprocessor simulator.
 */
export class Et3400 {
  #monitorProgram;
  
  /** @constructor */
  constructor() {
    this.memory = new Memory();
    this.microprocessor = new Microprocessor(this, this.memory);
    this.addressingMethods = contstructAddressingMethodTable(this.microprocessor);
    // Holds the current state of each seven-segment display
    this.displayLeds = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    // Holds the DOM elements for each seven-segment display
    this.displayElements = [
      document.querySelector('#display-h'),
      document.querySelector('#display-i'),
      document.querySelector('#display-n'),
      document.querySelector('#display-z'),
      document.querySelector('#display-v'),
      document.querySelector('#display-c')
    ];

    this.initialize();
    this.powered = false;
  }


  /**
   * Loads a hexadecimal string into memory starting at the specified address.
   * @param {number} address - The starting address in memory.
   * @param {string} string - The hexadecimal string to load into memory.
   */
  loadHex(address, string) {
    const length = string.length;
    // Set the HALT flag to prevent the microprocessor from running while memory is being modified
    this.microprocessor.HALT(0);
    // Load the string into memory, two characters at a time
    for (let index = 0; index < length; index += 2) {
      this.memory.writeByte(address++, parseInt(string.substr(index, 2), 16));
    }
    // Clear the HALT flag to allow the microprocessor to run again
    this.microprocessor.HALT(1);
  }

  
  /**
   * Loads a program into the ET3400 microprocessor. This method uses internal
   * microprocessor methods to load the program into memory.  As Such, it should
   * Only be used during initialization for the Monitor Program. For all other
   * purposes, the loadHex method should be used instead.
   * @param {number} address - The starting address of the program.
   * @param {string} string - The program code as a string.
   */
  loadProgram(address, string) {
    // Set the program counter to the specified address
    this.microprocessor.programCounter = address;
    const length = string.length;
    // Load the string into memory
    for (let index = 0; index < length; index++) {
      this.microprocessor.SMB(string.charCodeAt(index));
    }
  }

  /**
   * Toggles the power state of the ET-3400 simulator.
   */
  powerButton() {
    // Flip the power state
    const functionName = this.powered ? 'powerOff' : 'powerOn';
    this[functionName]();
    // Change shading to indicate switch flip on power buttons
    const buttons = document.querySelectorAll('.power-button');
    for (let index = 0; index < 2; index++) {
      const element = buttons[index];
      element.innerText = element.innerText === 'O' ? 'II' : 'O';
      element.classList.toggle('active');
    }
    // Update Power LED on Simulator
    const simulatorLight = document.querySelector('#power-led');
    const func = this.powered ? 'add' : 'remove';
    simulatorLight.classList[func]('power-on');
    // Update Power Switch on Simulator
    const simulatorSwitch = document.querySelector('.power-switch');
    simulatorSwitch.classList.add(this.powered ? 'on' : 'off');
    simulatorSwitch.classList.remove(this.powered ? 'off' : 'on');
  }

  /**
   * Turns on the ET-3400 simulator.
   */
  powerOn() {
    this.powered = true;
    // Clear the display update flag
    globalThis.doDisplayUpdate = undefined;
    this.microprocessor.HALT(1);
    // Update Power LED on Simulator and add the glow effect
    document.querySelector('.power-led').classList.add('active');
    document.querySelector('#power-led-glow').classList.add('on');
    this.clearDisplayLeds();
    // Prepare Monitor Program
    this.loadProgram(0xFC00, this.#monitorProgram);
    this.reset();
  }

  /**
   * Turns off the ET-3400 simulator.
   */
  powerOff() {
    this.microprocessor.HALT(0);
    this.powered = false;
    document.querySelector('.power-led').classList.remove('active');
    document.querySelector('#power-led-glow').classList.remove('on');
    globalThis.doDisplayUpdate = undefined;
    this.clearDisplayLeds();
    // Reset Memory
    this.memory.clear();
  }

  /**
   * Initializes the ET3400 module.
   */
  initialize() {
    this.#monitorProgram = ROM;
    const encodedDTA = '2023202020202323434323232323232323232020212023232023202320202020442044444444444444444444444444444343434343434343205320A3202093C32320202323202323232323202323202323202023232023232323232023232023752020757520757575757520757547776D20206D6D206D6D6D6D6D206D6D3F6F2828282028282821282828283C843C21393939203939394B393939394A214A5B555555205555556755555555668766774D4D4D204D4D4D5F4D4D4D4D5E9F5E6F28282820282828212828282820203C21393939203939394B3939393920214A5B555555205555556755555555202066774D4D4D204D4D4D5F4D4D4D4D20205E6F';
    const DTA = hex2binary(encodedDTA);
    globalThis.DCD = [];
    for (let index = 0; index < 256; ++index) {
      const CAM = DTA.charCodeAt(index);
      globalThis.DCD[index] = this.addressingMethods[CAM & 0x0F];
    }
  }

  /**
   * Sets all display LEDs values to 0x00, then updates the displays.
   */
  clearDisplayLeds() {
    for (let index = 0; index < 6; index++) {
      this.displayLeds[index] = 0x00;
    }
    this.updateLedDisplay();
  }

  /**
   * Resets the ET3400 simulator.
   */
  reset() {
    this.updateLedDisplay();
    this.microprocessor.reset();
  }

  /**
   * Updates the LED display; called after the hexadecimal values are updated.
   */
  updateLedDisplay() {
    let string = '';
    let currentlyLit = false;
    for (let rowNumber = 0; rowNumber < 3; ++rowNumber) {
      for (let ledNumber = 0; ledNumber < 6; ++ledNumber) {
        for (let columnNumber = 0; columnNumber < 4; ++columnNumber) {
          let number = rowNumber * 4 + columnNumber;
          if ((number < 4 && number !== 1) || number === 7) {
            string += ' ';
            continue;
          }
          const displayCharacter = '_|_.'.charAt(columnNumber);
          const shift = [0, 6, 0, 0, 1, 0, 5, 0, 2, 3, 4, 7][number];
          const stillLit = (this.displayLeds[ledNumber] & (1 << shift)) !== 0;
          if (stillLit === currentlyLit) {
            string += displayCharacter;
          } else {
            currentlyLit = stillLit;
            string += `<${currentlyLit ? '' : '/'}b>${displayCharacter}`;
          }
        }
      }
      string += '\n';
    }
    document.querySelector('#plaintext-display').innerHTML = string;
    this.updateSimulatorDisplay();
    if (globalThis.popout) {
      globalThis.popout.postMessage(`updateDisplay:${string}`, '*');
    }
    globalThis.doDisplayUpdate = false;
  }

  /**
   * Updates the simulator display to match the plaintext display.
   */
  updateSimulatorDisplay() {
    const htmlString = document.querySelector('#plaintext-display').innerHTML;
    const replacedString = htmlString.replaceAll(/<\/*b>/g, 'x');
    const stringArray = replacedString.split('\n');
    let lit = false;
    let characterPosition = 0;
    const rowSegmentArray = [[null, 'a', null, null], ['f', 'g', 'b', null], ['e', 'd', 'c', 'dp']];
    for (let row = 0; row < 3; row++) {
      characterPosition = 0;
      const rowSegment = rowSegmentArray[row];
      const string = stringArray[row];
      const length = string.length;
      for (let position = 0; position < length; position++) {
        const className = rowSegment[characterPosition % 4];
        const isMeta = string[position] === 'x';
        if (isMeta) {
          lit = !lit;
        }
        if (className !== null) {
          const segment = this.displayElements[Math.floor(characterPosition / 4)];
          const func = lit ? 'add' : 'remove';
          segment.classList[func](className);
        }
        if (!isMeta) characterPosition++;
      }
    }
  }

  /**
   * Logs the current state of the ET3400 microprocessor for debugging purposes.
   */
  debugState() {
    const mpu = this.microprocessor;
    const programCounter = mpu.programCounter;
    const accumulatorA = mpu.accumulatorA;
    const accumulatorB = mpu.accumulatorB;
    const addressRegister = mpu.addressRegister;
    console.debug(`
    Program Counter ${programCounter}  0x${padWordHex(programCounter)}  0b${padByteBinary(programCounter)}
    Accumulator A ${accumulatorA}  0x${padWordHex(accumulatorA)}  0b${padByteBinary(accumulatorA)}
    Accumulator B ${accumulatorB}  0x${padWordHex(accumulatorB)}  0b${padByteBinary(accumulatorB)}
    Address ${addressRegister}  0x${padWordHex(addressRegister)}  0b${padByteBinary(addressRegister)}
    Operand ${mpu.operand}
    Condition Codes Register:
      (H)alf ${mpu.statusRegister.half}
      (I)nterrupt ${mpu.statusRegister.interrupt}
      (N)egative ${mpu.statusRegister.negative}
      (Z)ero ${mpu.statusRegister.zero}
      O(V)erflow ${mpu.statusRegister.overflow}
      (C)arry ${mpu.statusRegister.carry}
    Memory : %o
    `, this.memory);
  }

  /**
   * Presses a key on the ET3400 simulator.
   * @param {number} keyCode - The key code of the pressed key.
   */
  pressKey(keyCode) {
    if (keyCode === null) {
      return;
    }
    const address = 0xC000 | keyCode & 0x0f;
    const keyUp = 1 << (keyCode >> 4);
    const keyDown = 255 - keyUp;
    this.microprocessor.WMB(address, this.microprocessor.RMB(address) & keyDown);
  }

  /**
   * Releases a key on the ET-3400 simulator.
   * @param {number} keyCode - The key code of the released key.
   */
  releaseKey(keyCode) {
    if (keyCode === null) {
      return this.reset();
    }
    const address = 0xC000 | keyCode & 0x0f;
    const keyUp = 1 << (keyCode >> 4);
    this.microprocessor.WMB(address, this.microprocessor.RMB(address) | keyUp);
  }
}
