export class KeypadKey {
  constructor(keyboardActivation, keyCode, selector, simulator) {
    this.keyboardActivation = keyboardActivation;
    this.keyCode = keyCode;
    this.selector = selector;
    this.simulator = simulator;
    this.abortControllers = {
      click: null,
      keyUpDown: null,
      touchStartEnd: null
    };
  }
}

export const keypad = {
  ACCA: new KeypadKey('1', 0x46, '#button-acca', '#acca'),
  ACCB: new KeypadKey('2', 0x45, '#button-accb', '#accb'),
  AUTO: new KeypadKey('A', 0x16, '#button-auto', '#auto'),
  BACK: new KeypadKey('B', 0x15, '#button-back', '#back'),
  BR: new KeypadKey('9', 0x23, '#button-br', '#br'),
  CC: new KeypadKey('5', 0x35, '#button-cc', '#cc'),
  CHAN: new KeypadKey('C', 0x13, '#button-chan', '#chan'),
  DO: new KeypadKey('D', 0x06, '#button-do', '#do'),
  EXAM: new KeypadKey('E', 0x05, '#button-exam', '#exam'),
  FWD: new KeypadKey('F', 0x03, '#button-fwd', '#fwd'),
  INDEX: new KeypadKey('4', 0x36, '#button-index', '#index'),
  PC: new KeypadKey('3', 0x43, '#button-pc', '#pc'),
  RESET: new KeypadKey('ESCAPE', null, '#button-reset', '#reset'),
  RTI: new KeypadKey('7', 0x26, '#button-rti', '#rti'),
  SP: new KeypadKey('6', 0x33, '#button-sp', '#sp'),
  SS: new KeypadKey('8', 0x25, '#button-ss', '#ss'),
  ZERO: new KeypadKey('0', 0x56, '#button-zero', '#zero')
};
