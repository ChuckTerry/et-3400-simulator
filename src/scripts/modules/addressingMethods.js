/**
 * @typedef {import('./Microprocessor.js').Microprocessor} Microprocessor
 */

/**  @type {Microprocessor} */
let microprocessor;

/**
 * Direct Byte Read Addressing Method
 * The byte following the opcode is used as the low byte of the address.
 * 
 * @returns {number}
 */
function directByteRead() {
    const address = microprocessor.GMB();
    return microprocessor.RMB(address);
}

/**
 * Direct Word Read Addressing Method
 * The byte following the opcode is used as the low byte of the address.
 * 
 * @returns {number}
 */
function directWordRead() {
    const address = microprocessor.GMB();
    return microprocessor.RMW(address);
}

/**
 * Direct Word Write Addressing Method
 * The byte following the opcode is used as the low byte of the address.
 * 
 * @returns {string}
 */
function directWordWrite() {
    microprocessor.addressRegister = microprocessor.GMB();
    return 'Direct Word Write';
}

/**
 * Extended Byte Read Addressing Method
 * The two bytes following the opcode are used as the address.
 * 
 * @returns {number}
 */
function extendedByteRead() {
    const address = microprocessor.GMW();
    return microprocessor.RMB(address);
}

/**
 * Extended Word Read Addressing Method
 * The two bytes following the opcode are used as the address.
 * 
 * @returns {number}
 */
function extendedWordRead() {
    const address = microprocessor.GMW();
    return microprocessor.RMW(address);
}

/**
 * Extended Word Write Addressing Method
 * The two bytes following the opcode are used as the address.
 * 
 * @returns {string}
 */
function extendedWordWrite() {
    microprocessor.addressRegister = microprocessor.GMW();
    return 'Extended Word Write';
}

/**
 * Immediate Byte Addressing Method
 * The byte following the opcode is used as the operand.
 * 
 * @returns {number}
 */
function immediateByte() {
    const address = microprocessor.programCounter;
    return microprocessor.GMB(address);
}

/**
 * Immediate Word Addressing Method
 * The two bytes following the opcode are used as the operand.
 * 
 * @returns {number}
 */
function immediateWord() {
    const address = microprocessor.programCounter;
    return microprocessor.GMW(address);
}

/**
 * 
 * @returns {number}
 */
function indexedByteRead() {
    const address = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
    return microprocessor.RMB(address);
}

/**
 * 
 * @returns {number}
 */
function indexedWordRead() {
    const address = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
    return microprocessor.RMW(address);
}

/**
 * 
 * @returns {string}
 */
function indexedWordWrite() {
    microprocessor.addressRegister = (microprocessor.indexRegister + microprocessor.GMB()) & 0xFFFF;
    return 'Indexed Word Write';
}

/**
 * Inherent Addressing Method
 * This addressing method does not require any additional bytes for operands.
 * 
 * @returns {string}
 */
function inherent() {
    return 'Inherent';
}

/**
 * Invalid Addressing Method
 * This addressing method indicates an invalid or illegal opcode.
 * 
 * @returns {string}
 */
function invalid() {
    return 'ERROR: Invalid/Illegal Opcode';
}

/**
 * Relative Addressing Method
 * The byte following the opcode is used as a signed offset from the current program counter.
 * 
 * @returns {number}
 */
function relative() {
    const operand = microprocessor.GMB();
    microprocessor.operand = operand;
    const address = microprocessor.programCounter + operand - (operand > 128 ? 256 : 0);
    microprocessor.addressRegister = address & 0xFFFF;
    return operand;
}

/**
 * Reserved Addressing Method
 * This addressing method is reserved for future use.
 * It is kept for consistency in the addressing method table.
 * 
 * @returns {string}
 */
function reserved() {
    return 'Reserved';
}

/**
 * Undocumented Addressing Method
 * This addressing method is including for debugging purposes.
 * 
 * @returns {string}
 */
function undocumented() {
    return 'ERROR: Undocumented Opcode';
}

/**
 * 
 * @param {Microprocessor} microprocessorInstance 
 * @returns {Array<Function>} Addressing Method Table
 */
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
