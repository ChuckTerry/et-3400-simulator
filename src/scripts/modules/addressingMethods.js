let microprocessor;

function directByteRead() {
  const address = microprocessor.GMB();
  return microprocessor.RMB(address);
}

function directWordRead() {
  const address = microprocessor.GMB();
  return microprocessor.RMW(address);
}

function directWordWrite() {
  microprocessor.addressRegister = microprocessor.GMB();
  return 'Direct Word Write';
}

function extendedByteRead() {
  const address = microprocessor.GMW();
  return microprocessor.RMB(address);
}

function extendedWordRead() {
  const address = microprocessor.GMW();
  return microprocessor.RMW(address);
}

function extendedWordWrite() {
  microprocessor.addressRegister = microprocessor.GMW();
  return 'Extended Word Write';
}

function immediateByte() {
  const address = microprocessor.programCounter;
  return microprocessor.GMB(address);
}

function immediateWord() {
  const address = microprocessor.programCounter;
  return microprocessor.GMW(address);
}

function indexedByteRead() {
  const address = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
  return microprocessor.RMB(address);
}

function indexedWordRead() {
  const address = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
  return microprocessor.RMW(address);
}

function indexedWordWrite() {
  microprocessor.addressRegister = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
  return 'Indexed Word Write';
}

function inherent() {
  return 'Inherent';
} 

function invalid() {
  return 'ERROR: Invalid/Illegal Opcode';
}

function relative() {
  const operand = microprocessor.GMB();
  microprocessor.operand = operand;
  const address = microprocessor.programCounter + operand - (operand > 128 ? 256 : 0);
  microprocessor.addressRegister = address & 0xFFFF;
  return operand;
}

// Currently Unused
function reserved() {
  return 'Reserved';
}

function undocumented() {
  return 'ERROR: Undocumented Opcode';
}

export function contstructAddressingMethodTable(microprocessorInstance) {
  microprocessor = microprocessorInstance;
  return [
    invalid,
    undocumented,
    reserved,
    inherent,
    relative,
    indexedByteRead,
    indexedWordRead,
    indexedWordWrite,
    immediateByte,
    directByteRead,
    directWordRead,
    directWordWrite,
    immediateWord,
    extendedByteRead,
    extendedWordRead,
    extendedWordWrite
  ];
}
