import { Microprocessor } from './Microprocessor.js';
import { contstructAddressingMethodTable } from './addressingMethods.js';
import { padByteBinary, padWordHex } from './util.js';


function hex2binary(string) {
  const length = string.length;
  let returnValue = '';
  for (let index = 0; index < length; ++index) {
    returnValue += String.fromCharCode(parseInt(string.substr(index++, 2), 16));
  }
  return returnValue;
}

export class Et3400 {

  static keypad = {
    DO: {
      keyboardActivation: 'D',
      keyCode: 0x06,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-do',
      simulator: '#do'
    },
    EXAM: {
      keyboardActivation: 'E',
      keyCode: 0x05,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-exam',
      simulator: '#exam'
    },
    FWD: {
      keyboardActivation: 'F',
      keyCode: 0x03,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-fwd',
      simulator: '#fwd'
    },
    AUTO: {
      keyboardActivation: 'A',
      keyCode: 0x16,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-auto',
      simulator: '#auto'
    },
    BACK: {
      keyboardActivation: 'B',
      keyCode: 0x15,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-back',
      simulator: '#back'
    },
    CHAN: {
      keyboardActivation: 'C',
      keyCode: 0x13,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-chan',
      simulator: '#chan'
    },
    RTI: {
      keyboardActivation: '7',
      keyCode: 0x26,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-rti',
      simulator: '#rti'
    },
    SS: {
      keyboardActivation: '8',
      keyCode: 0x25,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-ss',
      simulator: '#ss'
    },
    BR: {
      keyboardActivation: '9',
      keyCode: 0x23,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-br',
      simulator: '#br'
    },
    INDEX: {
      keyboardActivation: '4',
      keyCode: 0x36,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-index',
      simulator: '#index'
    },
    CC: {
      keyboardActivation: '5',
      keyCode: 0x35,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-cc',
      simulator: '#cc'
    },
    SP: {
      keyboardActivation: '6',
      keyCode: 0x33,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-sp',
      simulator: '#sp'
    },
    ACCA: {
      keyboardActivation: '1',
      keyCode: 0x46,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-acca',
      simulator: '#acca'
    },
    ACCB: {
      keyboardActivation: '2',
      keyCode: 0x45,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-accb',
      simulator: '#accb'
    },
    PC: {
      keyboardActivation: '3',
      keyCode: 0x43,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-pc',
      simulator: '#pc'
    },
    ZERO: {
      keyboardActivation: '0',
      keyCode: 0x56,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-zero',
      simulator: '#zero'
    },
    RESET: {
      keyboardActivation: 'ESCAPE',
      keyCode: null,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-reset',
      simulator: '#reset'
    }
  };

  constructor() {
    this.microprocessor = new Microprocessor();
    this.addressingMethods = contstructAddressingMethodTable(this.microprocessor);
    this.displayLeds = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    this.powered = false;
  }

  loadProgram(address, string) {
    this.microprocessor.programCounter = address;
    const length = string.length;
    for (let index = 0; index < length; index++) {
      this.microprocessor.SMB(string.charCodeAt(index));
    }
  }

  powerButton() {
    const functionName = this.powered ? 'powerOff' : 'powerOn';
    this[functionName]();
    // Change shading to indicate switch flip on power buttons
    const buttons = document.querySelectorAll('.power-button');
    buttons.forEach(element => {
      element.innerText = element.innerText === 'O' ? 'II' : 'O';
      element.classList.toggle('active');
    });
    // Update Power LED on Simulator
    const simulatorLight = document.querySelector('#Power_LED');
    const func = this.powered ? 'add' : 'remove';
    simulatorLight.classList[func]('power-on');
  }

  powerOn() {
    this.microprocessor.HALT(1);
    this.powered = true;
    document.querySelector('.power-led').classList.add('active');
    // Initialize globals to undefined
    const globals = ['CLK', 'OPC', 'OPD', 'bOn', 'doDisplayUpdate'];
    const globalsLength = globals.length;
    for (let index = 0; index < globalsLength; index++) {
      globalThis[globals[index]] = undefined;
    }
    this.clearDisplayLeds();
    // Initialize Decoded Instruction Array
    globalThis.DCD = new Array(256);
    // Initialize Instruction Cycle Count Array
    globalThis.CYC = new Array(256);
    // Initialize Memory as a Zero-Filled aArray
    globalThis.MEM = new Array(0x10000).fill(0);
    // Prepare Monitor Program
    const et3400Monitor = atob('jgDrvf2NTmc+AD7nzgDL3/KG/8YINlom/Jfuhhk2hvw2vf30fQDuJwiBDyf0gQsn8N/szv+0CAhKKvumATamADbe7JbuOc4A4ob/xgQICKEAJgShAScOWibzvf2NAEc+Dg6gTDnf7o0dH4WNCEw53+6NEz2djUXe7sYCfv0l3+6NBHe9IO/OwS9+/lDe8ggICAgICI3ZjSRPxga9/jpaJvqNGb3+a8YEMO4IpgA2NoY/pwBaJvLO/M5+/vzf7M7Bb9/w3uw5zgDujbPe7jkwn/KmBiYCagVKpwbmBdfsl+0MjgDZxgQyMjDuCJzsJgENpwBaJvEkrN7sjcHf7s4A7sYCjQPuAFp+/XuNuo3rjQsIIPmNsQkICAkg3l0nBjaNIo0CMjk3hghYvf46Wib6M40RN73+CacACFom9zMXCUom/Dk3lvGLIFom+5fxMzmNOzCVIBaNNXcNDf0gEI0tdw0NnyAJjSVnjUxMXExMXIsC3vIISib8jQJMOTemAL3+IAhaJvczFwlKJvw5X87Bb37+UL38vN7yxiBP5QEnAUy9/ihWJvRMOY3iW+fW88sHmfKNbBdfjWiGATk39sADtsAGSEhIWUhZSFk39sAFxB8bM0NT3+zO/6URJxEkBjYXM87/rV0mBghIIvwnAQymAN7sMzk3xiCNwiX6Wib5xiCNuST6Wib5MzmN6Y0bSEhISDcWjd+NERszNo2fJfwyOTZEREREjQEyNoQP3+zO/5UISir8pgCNBDI53+ze8DdJScYQSacACVom+d/w3uwzOd/wMO4AMTGmAI3fCE0q+E9uAI0H3vLuBn78+Z/u3vKmBzamBjbuBoY/NjamAjamATamADYWzv91CMAIJPumAEZcJvwyNiUegTAkBIEgJBSBYCURgY0nDIS9gYwnBIQwgTDC/1xcJ3AwJQLnAYYBwQIuBicCpwGnAk/rBqkFpwXnBt7ypwbnB8YGMjaEz4GNMidIgW4nW4F+J16BOSdigTsnbIE/J26vBjbO/wWGfpf03/We8jsw7gUIT1+c7iYMCe4ACeYAKgFDMO4F6wGpADCnBecGCd/ynu45gY0mAoZfgD82CQnf8qYDpwEIWir4IJAzT+sFqQSMMjOnBucHINUICN/ypgOnBQlaLvggyQhaKvwgwaYHpwAJWir4ihCnAcb6hgAg1JwAPK9AAACsZBJkEmQQZBARARAEEAAQABENEAwQDBAMfjBteTNbX3B/e3cfTj1PRwcKDQIFCAsOAwYJDA8AAQT8Rf1V/V39Zf1P/ZP9qPyW/mL8Rv0K/Rj9G/yM/RP9Fv////////////////////////////////////////////8A9wD0AP38AA==');
    const encodedDTA = '2023202020202323434323232323232323232020212023232023202320202020442044444444444444444444444444444343434343434343205320A3202093C32320202323202323232323202323202323202023232023232323232023232023752020757520757575757520757547776D20206D6D206D6D6D6D6D206D6D3F6F2828282028282821282828283C843C21393939203939394B393939394A214A5B555555205555556755555555668766774D4D4D204D4D4D5F4D4D4D4D5E9F5E6F28282820282828212828282820203C21393939203939394B3939393920214A5B555555205555556755555555202066774D4D4D204D4D4D5F4D4D4D4D20205E6F';
    const DTA = hex2binary(encodedDTA);
    for (let index = 0; index < 256; ++index) {
      console.debug('> ' + index);
      // Content-Addressable Memory
      const CAM = DTA.charCodeAt(index);
      console.debug('  CAM ' + CAM);
      CYC[index] = CAM >> 4;
      console.debug('  CYC (CAM >> 4) ' + CYC[index]);
      DCD[index] = this.addressingMethods[CAM & 0x0F];
      console.debug('  DCD ' + DCD[index]);
    }
    this.loadProgram(0xFC00, et3400Monitor);
    this.reset();
  }

  powerOff() {
    this.microprocessor.HALT(0);
    // if (globalThis.TMR) clearTimeout(TMR);
    this.powered = false;
    document.querySelector('.power-led').classList.remove('active');
    // Reset globals to undefined
    const globals = ['CLK', 'OPC', 'OPD', 'bOn', 'doDisplayUpdate'];
    const globalsLength = globals.length;
    for (let index = 0; index < globalsLength; index++) {
      globalThis[globals[index]] = undefined;
    }
    // Clear LED states
    this.clearDisplayLeds();
    // Reset Decoded Instruction Array
    globalThis.DCD = new Array(256);
    // Reset Instruction Cycle Count Array
    globalThis.CYC = new Array(256);
    // Reset Memory
    globalThis.MEM = new Array(0x10000);
  }

  clearDisplayLeds() {
    for (let index = 0; index < 6; index++) {
      this.displayLeds[index] = 0x00;
    }
    this.updateLedDisplay();
  }

  reset() {
    this.updateLedDisplay();
    this.microprocessor.reset();
  }

  updateLedDisplay() {
    let string = '';
    bOn = 0;
    for (let rowNumber = 0; rowNumber < 3; ++rowNumber) {
      for (let ledNumber = 0; ledNumber < 6; ++ledNumber) {
        for (let columnNumber = 0; columnNumber < 4; ++columnNumber) {
          string += this.getSegment(this.displayLeds[ledNumber], columnNumber, rowNumber);
        }
      }
      string += '\n';
    }
    document.querySelector('#plaintext-display').innerHTML = string;
    this.updateSimulatorDisplay();
    if (globalThis.popout) {
      globalThis.popout.postMessage(`updateDisplay:${string}`, '*');
    }
    doDisplayUpdate = false;
  }

  getSegment(ledNumber, columnNumber, rowNumber) {
    let number = rowNumber * 4 + columnNumber;
    // Segment Number x Display Position
    let character = ' 6  105 2347'.charAt(number);
    if (character != ' ') {
      number = '_||_||_.'.charAt(character);
      character = (ledNumber & (1 << character)) !== 0;
      character = character == bOn
        ? number
        : (bOn = character)
          ? '<b>' + number
          : '</b>' + number;
    }
    return character;
  }

  updateSimulatorDisplay() {
    const htmlString = document.querySelector("#plaintext-display").innerHTML;
    const replacedString = htmlString.replaceAll(/\<\/*b\>/g, 'x');
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
          const segment = globalThis.segmentDisplays[Math.floor(characterPosition / 4)];
          const func = lit ? 'add' : 'remove';
          segment.classList[func](className);
        }
        if (!isMeta) characterPosition++;
      }
    }
  }

  debugState() {
    const mpu = this.microprocessor;
    const programCounter = mpu.programCounter;
    const accumulatorA = mpu.accumulatorA;
    const accumulatorB = mpu.accumulatorB;
    const addressRegister = this.microprocessor.addressRegister;
    console.debug(`
    Program Counter ${programCounter}  0x${padWordHex(programCounter)}  0b${padByteBinary(programCounter)}
    Accumulator A ${accumulatorA}  0x${padWordHex(accumulatorA)}  0b${padByteBinary(accumulatorA)}
    Accumulator B ${accumulatorB}  0x${padWordHex(accumulatorB)}  0b${padByteBinary(accumulatorB)}
    Address ${addressRegister}  0x${padWordHex(addressRegister)}  0b${padByteBinary(addressRegister)}
    OPD ${OPD}
    Condition Codes Register:
      (H)alf ${mpu.statusRegister.half}
      (I)nterrupt ${mpu.statusRegister.interrupt}
      (N)egative ${mpu.statusRegister.negative}
      (Z)ero ${mpu.statusRegister.zero}
      O(V)erflow ${mpu.statusRegister.overflow}
      (C)arry ${mpu.statusRegister.carry}
    Memory : %o
    `, MEM);
  }

  pressKey(keyCode) {
    if (keyCode === null) {
      return;
    }
    const address = 0xC000 | keyCode & 0x0f;
    const keyUp = 1 << (keyCode >> 4);
    const keyDown = 255 - keyUp;
    this.microprocessor.WMB(address, this.microprocessor.RMB(address) & keyDown);
  }

  releaseKey(keyCode) {
    if (keyCode === null) {
      return this.reset();
    }
    const address = 0xC000 | keyCode & 0x0f;
    const keyUp = 1 << (keyCode >> 4);
    this.microprocessor.WMB(address, this.microprocessor.RMB(address) | keyUp);
  }
}
