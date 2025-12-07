import { StatusRegister } from './StatusRegister.js';
/**
 * @typedef {import('../Et3400.js').Et3400} Et3400
 */

/**
 * Microprocessor Class
 */
export class Microprocessor {
    #fetchDecodeExecuteLoopTimer; #halt;

    static #opCodeCycles = [2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 5, 2, 10, 2, 2, 9, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 2, 2, 7, 7, 2, 7, 7, 7, 7, 7, 2, 7, 7, 4, 7, 6, 2, 2, 6, 6, 2, 6, 6, 6, 6, 6, 2, 6, 6, 3, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 8, 3, 2, 3, 3, 3, 2, 3, 3, 3, 4, 3, 3, 3, 3, 4, 2, 4, 5, 5, 5, 5, 2, 5, 5, 5, 6, 5, 5, 5, 5, 6, 8, 6, 7, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 4, 4, 5, 9, 5, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 4, 3, 3, 3, 3, 2, 2, 4, 5, 5, 5, 5, 2, 5, 5, 5, 6, 5, 5, 5, 5, 2, 2, 6, 7, 4, 4, 4, 2, 4, 4, 4, 5, 4, 4, 4, 4, 2, 2, 5, 6];

    /**
     * Encoded string containing instruction set mnemonics
     */
    static encodedInstructionMatrix = {
        default: 'SU9QAE5PUABJT1AASU9QAElPUABJT1AAVEFQAFRQQQBJTlgAREVYAENMVgBTRVYAQ0xDAFNFQwBDTEkAU0VJAFNCQQBDQkEASU9QAElPUABIQ0YASU9QAFRBQgBUQkEASU9QAERBQQBJT1AAQUJBAElPUABJT1AASU9QAElPUABKTVAASU9QAEJISQBCTFMAQkNDAEJDUwBCTkUAQkVRAEJWQwBCVlMAQlBMAEJNSQBCR0UAQkxUAEJHVABCTEUAVFNYAElOUwBQVUxBAFBVTEIAREVTAFRYUwBQU0hBAFBTSEIASU9QAFJUUwBJT1AAUlRJAElPUABJT1AAV0FJAFNXSQBORUdBAElPUABJT1AAQ09NQQBMU1JBAElPUABST1JBAEFTUkEAQVNMQQBST0xBAERFQ0EASU9QAElOQ0EAVFNUQQBJT1AAQ0xSQQBORUdCAElPUABJT1AAQ09NQgBMU1JCAElPUABST1JCAEFTUkIAQVNMQgBST0xCAERFQ0IASU9QAElOQ0IAVFNUQgBJT1AAQ0xSQgBORUcASU9QAElPUABDT00ATFNSAElPUABST1IAQVNSAEFTTABST0wAREVDAElPUABJTkMAVFNUAEpNUABDTFIATkVHAElPUABJT1AAQ09NAExTUgBJT1AAUk9SAEFTUgBBU0wAUk9MAERFQwBJT1AASU5DAFRTVABKTVAAQ0xSAFNVQkEAQ01QQQBTQkNBAElPUABBTkRBAEJJVEEATERBQQBIQ0YARU9SQQBBRENBAE9SQUEAQUREQQBDUFgAQlNSAExEUwBIQ0YAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASENGAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQgBDTVBCAFNCQ0IASU9QAEFOREIAQklUQgBMREFCAEhDRgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAEhDRgBTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABIQ0YATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWA=='
    };

    /**
     * Interrupt Vector Addresses
     * @property {number} IRQ - Interrupt Request Vector Address
     * @property {number} SWI - Software Interrupt Vector Address
     * @property {number} NMI - Non-Maskable Interrupt Vector Address
     * @property {number} RST - Reset Vector Address
     */
    static interruptVector = {
        IRQ: 0xFFF8,
        SWI: 0xFFFA,
        NMI: 0xFFFC,
        RST: 0xFFFE
    };

    /**
     * @constructor
     * @param {Et3400} et3400 
     * @param {Memory} memory 
     * @param {object} encodedInstructionMatrix 
     */
    constructor(et3400, memory, encodedInstructionMatrix = Microprocessor.encodedInstructionMatrix.default) {
        this.accumulatorA = 0;
        this.accumulatorB = 0;
        this.operand = 0;
        this.programCounter = 0;
        this.stackPointer = 0;
        this.indexRegister = 0;
        this.addressRegister = 0;
        this.result = 0;
        /** @type {Et3400} */
        this.et3400 = et3400;
        this.#fetchDecodeExecuteLoopTimer = 0;
        this.statusRegister = new StatusRegister();
        this.decodedInstructionNameLookup = atob(encodedInstructionMatrix).split('\x00');
        this.memory = memory;
        this.#halt = 1;
    }

    _lambda(opcode) {
        const mnemonic = this.decodedInstructionNameLookup[opcode];
        this[mnemonic]();
    }

    _cc_Carry_NegativeOverflowZero(carry, ARG) {
        ARG &= 0xFF;
        this.statusRegister.carry = carry;
        this.statusRegister.negative = ARG >> 7;
        this.statusRegister.overflow = carry ^ this.statusRegister.negative;
        this.statusRegister.zero = ARG ? 0 : 1;
        return ARG;
    }

    _cc_CarryOverflow_NegativeZero(carry, overflow, ARG) {
        this.statusRegister.carry = carry;
        this.statusRegister.overflow = overflow;
        this.statusRegister.negative = (ARG &= 0xFF) >> 7;
        this.statusRegister.zero = ARG ? 0 : 1;
        return ARG;
    }

    _cc_Overflow_NegativeZero(overflow, ARG) {
        this.statusRegister.overflow = overflow;
        this.statusRegister.negative = (ARG &= 0xFF) >> 7;
        this.statusRegister.zero = ARG ? 0 : 1;
        return ARG;
    }

    _cc__Carry(ARG, operand, RES) {
        this.statusRegister.carry = ((ARG = (ARG >> 7) & 1) & (operand = (operand >> 7) & 1)) | (operand & (RES = ~((RES >> 7) & 1))) | (RES & ARG);
    }

    _cc__Half(ARG, operand, RES) {
        this.statusRegister.half = ((ARG = (ARG >> 3) & 1) & (operand = (operand >> 3) & 1)) | (operand & (RES = ~((RES >> 3) & 1))) | (RES & ARG);
    }

    /**
     * Simulates the Fetch, Decode, Execute Loop of the Microprocessor
     * @returns {undefined}
     */
    fetchDecodeExecute() {
        if (this.#fetchDecodeExecuteLoopTimer) {
            window.clearTimeout(this.#fetchDecodeExecuteLoopTimer);
        }
        if (globalThis.doDisplayUpdate) {
            this.et3400.updateLedDisplay();
        }
        if (this.#halt === 0) {
            return;
        }
        let opcode = 0;
        for (let clock = 0; clock < 20000; clock += Microprocessor.#opCodeCycles[opcode]) {
            opcode = this.et3400.microprocessor.GMB();
            const func = globalThis.DCD[opcode];
            if (typeof func === 'function') {
                this.operand = func();
                this.et3400.microprocessor._lambda(opcode);
            }
        }
        this.#fetchDecodeExecuteLoopTimer = window.setTimeout(() => this.fetchDecodeExecute(), 50);
    }

    /**
     * Get Condition Code Register Value
     * @returns {number}
     */
    getConditionCodeRegister() {
        return this.statusRegister.value & 0xFF;
    }

    /**
     * Reset
     */
    reset() {
        this.HALT(0);
        this.WMB(0xC003, 0xFF);
        this.WMB(0xC005, 0xFF);
        this.WMB(0xC006, 0xFF);
        // Jump to position of Monitor Program
        this.addressRegister = this.RMW(Microprocessor.interruptVector.RST);
        this.JMP();
        this.HALT(1);
    }

    /**
     * Set Condition Code Register Value
     * @param {number} value 
     */
    setConditionCodeRegister(value) {
        this.statusRegister.value = value;
    }

    /**
     * Calculate Negative Flag
     * @description Calculates and sets the negative flag based on ARG.
     * @param {number} ARG 
     */
    calculateNegativeStatus(ARG) {
        this.statusRegister.negative = (ARG >> 7) & 1;
    }

    /**
     * Calculate Overflow Flag
     * @description Calculates and sets the overflow flag based on operation.
     * @param {number} ARG 
     * @param {number} operand 
     * @param {number} RES 
     * @returns 
     */
    calculateOverflowStatus(ARG, operand, RES) {
        return ((ARG = (ARG >> 7) & 1) & ~(operand = (operand >> 7) & 1) & ~(RES = (RES >> 7) & 1)) | (~ARG & operand & RES);
    }

    /**
     * Calculate Zero Flag
     * @description Calculates and sets the zero flag based on operation.
     * @param {number} ARG 
     */
    calculateZeroStatus(ARG) {
        this.statusRegister.zero = ARG ? 0 : 1;
    }

    /**
     * Adds Accumulator B to Accumulator A and stores the result in Accumulator A
     * 
     * 	[A] ← [A] + [B]
     */
    ABA() {
        this.operand = this.accumulatorB;
        this.accumulatorA = this.ADD(this.accumulatorA);
    }

    /**
     * Calculates the Condition Code Register for the Accumulator.
     * Used during Store and Load operations.
     */
    ACC(ARG) {
        return this._cc_Overflow_NegativeZero(0, ARG);
    }

    /**
     * Add With Carry Accumulator A.
     * @description Adds the operand with carry to the Accumulator A and stores 
     * the result in Accumulator A
     */
    ADCA() {
        this.accumulatorA = this.ADD(this.accumulatorA + this.statusRegister.carry);
    }

    /**
     * Add With Carry Accumulator B
     * @description Adds the operand with carry to the Accumulator B and stores 
     * the result in Accumulator B
     */
    ADCB() {
        this.accumulatorB = this.ADD(this.accumulatorB + this.statusRegister.carry);
    }

    /**
     * Add
     * @param {number} ARG 
     * @returns {number}
     */
    ADD(ARG) {
        return this._cc_Overflow_NegativeZero(
            this.calculateOverflowStatus(ARG, this.operand, this.result = ARG + this.operand),
            this.result,
            this._cc__Half(ARG, this.operand, this.result),
            this._cc__Carry(ARG, this.operand, this.result)
        );
    }

    /**
     * Add Accumulator A
     * @description Adds the operand to the Accumulator A and stores the result in
     *  Accumulator A
     */
    ADDA() {
        this.accumulatorA = this.ADD(this.accumulatorA);
    }

    /**
     * Add Accumulator B
     * @description Adds the operand to the Accumulator B and stores the result in
     *  Accumulator B
     */
    ADDB() {
        this.accumulatorB = this.ADD(this.accumulatorB);
    }

    /**
     * Bitwise And
     * @param {number} ARG 
     * @returns {number}
     */
    AND(ARG) {
        return this._cc_Overflow_NegativeZero(0, ARG & this.operand);
    }

    /**
     * And Accumulator A
     * @description Performs a bitwise AND operation on the operand and
     * Accumulator A and stores the result in Accumulator A.
     */
    ANDA() {
        this.accumulatorA = this.AND(this.accumulatorA);
    }

    /**
     * And Accumulator B
     * @description Performs a bitwise AND operation on the operand and
     * Accumulator B and stores the result in Accumulator B.
     */
    ANDB() {
        this.accumulatorB = this.AND(this.accumulatorB);
    }

    /**
     * Arithmetic Shift Left
     * @param {number} ARG 
     * @returns {number}
     */
    ASL(ARG) {
        return this._cc_Carry_NegativeOverflowZero((ARG >> 7) & 1, ARG << 1);
    }

    /**
     * Arithmetic Shift Left Accumulator A
     * @description Shifts the bits of Accumulator A one position to the left.
     */
    ASLA() {
        this.accumulatorA = this.ASL(this.accumulatorA);
    }

    /**
     * Arithmetic Shift Left Accumulator B
     * @description Shifts the bits of Accumulator B one position to the left.
     */
    ASLB() {
        this.accumulatorB = this.ASL(this.accumulatorB);
    }

    /**
     * Arithmetic Shift Left Memory
     * @description Shifts the bits of the operand one position to the left.
     */
    ASLM() {
        this.WMB(this.addressRegister, this.ASL(this.operand));
    }

    /**
     * Arithmetic Shift Right
     * @param {number} ARG 
     * @returns {number}
     */
    ASR(ARG) {
        return this._cc_Carry_NegativeOverflowZero(ARG & 1, (ARG >> 1) | (ARG & 0x80));
    }

    /**
     * Arithmetic Shift Right Accumulator A
     * @description Shifts the bits of Accumulator A one position to the right.
     */
    ASRA() {
        this.accumulatorA = this.ASR(this.accumulatorA);
    }

    /**
     * Arithmetic Shift Right Accumulator B
     * @description Shifts the bits of Accumulator B one position to the right.
     */
    ASRB() {
        this.accumulatorB = this.ASR(this.accumulatorB);
    }

    /**
     * Arithmetic Shift Right Memory
     * @description Shifts the bits of the operand one position to the right.
     */
    ASRM() {
        this.WMB(this.addressRegister, this.ASR(this.operand));
    }

    /**
     * Branch if Carry Clear
     * @description Branches to the address specified by the operand if the carry
     * flag is clear.
     */
    BCC() {
        this.BRA(!this.statusRegister.carry);
    }

    /**
     * Branch if Carry Set
     * @description Branches to the address specified by the operand if the carry
     * flag is set.
     */
    BCS() {
        this.BRA(this.statusRegister.carry);
    }

    /**
     * Branch if Equal
     * @description Branches to the address specified by the operand if the zero
     * flag is set.
     */
    BEQ() {
        this.BRA(this.statusRegister.zero);
    }

    /**
     * Branch if Greater or Equal
     * @description Branches to the address specified by the operand if the zero
     * flag is set or the negative flag is not equal to the overflow flag.
     */
    BGE() {
        this.BRA(!(this.statusRegister.negative ^ this.statusRegister.overflow));
    }

    /**
     * Branch if Greater Than
     * @description Branches to the address specified by the operand if the zero
     * flag is set or the negative flag is not equal to the overflow flag.
     */
    BGT() {
        this.BRA(!(this.statusRegister.zero | (this.statusRegister.negative ^ this.statusRegister.overflow)));
    }

    /**
     * Branch if Higher
     * @description Branches to the address specified by the operand if the carry
     * flag is clear and the zero flag is clear.
     */
    BHI() {
        this.BRA(!(this.statusRegister.carry | this.statusRegister.zero));
    }

    /**
     * Bit Test Accumulator A
     * @description Performs a bitwise AND operation on the operand and
     * Accumulator A to set the condition code register without changing the
     * contents of the accumulator.
     */
    BITA() {
        this.AND(this.accumulatorA);
    }

    /**
     * Bit Test Accumulator B
     * @description Performs a bitwise AND operation on the operand and
     * Accumulator B to set the condition code register without changing the
     * contents of the accumulator.
     */
    BITB() {
        this.AND(this.accumulatorB);
    }

    /**
     * Branch if Less or Equal
     * @description Branches to the address specified by the operand if the
     * negative flag is equal to the overflow flag.
     */
    BLE() {
        this.BRA(this.statusRegister.zero | (this.statusRegister.negative ^ this.statusRegister.overflow));
    }

    /**
     * Branch if Lower or Same
     * @description Branches to the address specified by the operand if the carry
     * flag is clear or the zero flag is set.
     */
    BLS() {
        this.BRA(this.statusRegister.carry | this.statusRegister.zero);
    }

    /**
     * Branch if Less Than
     * @description Branches to the address specified by the operand if the
     * negative flag is not equal to the overflow flag.
     */
    BLT() {
        this.BRA(this.statusRegister.negative ^ this.statusRegister.overflow);
    }

    /**
     * Branch if Minus
     * @description Branches to the address specified by the operand if the
     * negative flag is set.
     */
    BMI() {
        this.BRA(this.statusRegister.negative);
    }

    /**
     * Branch if Not Equal
     * @description Branches to the address specified by the operand if the zero
     * flag is clear.
     */
    BNE() {
        this.BRA(!this.statusRegister.zero);
    }

    /**
     * Branch if Plus
     * @description Branches to the address specified by the operand if the
     * negative flag is clear.
     */
    BPL() {
        this.BRA(!this.statusRegister.negative);
    }

    /**
     * Branch
     * @param {number} CC Condition Code
     */
    BRA(CC) {
        if (CC) {
            this.JMP();
        }
    }

    /**
     * Branch to Subroutine
     * @description Pushes the current program counter onto the stack and then
     * branches to the address specified by the operand.
     */
    BSR() {
        this.JSR();
    }

    /**
     * Branch if Overflow Clear
     * @description Branches to the address specified by the operand if the
     * overflow flag is clear.
     */
    BVC() {
        this.BRA(!this.statusRegister.overflow);
    }

    /**
     * Branch if Overflow Set
     * @description Branches to the address specified by the operand if the
     * overflow flag is set.
     */
    BVS() {
        this.BRA(this.statusRegister.overflow);
    }

    /**
     * Compare Accumulators
     * @description Compares the contents of Accumulator A with the contents of
     * Accumulator B.
     */
    CBA() {
        this.operand = this.accumulatorB;
        this.CMP(this.accumulatorA);
    }

    /**
     * Clear Carry
     */
    CLC() {
        this.statusRegister.carry = 0;
    }

    /**
     * CLear Interrupt
     */
    CLI() {
        this.statusRegister.interrupt = 0;
    }

    /**
     * Clear
     * @returns {number}
     */
    CLR() {
        this.statusRegister.carry = 0;
        return this._cc_Overflow_NegativeZero(0, 0);
    }

    /**
     * Clear Accumulator A
     * @description Clears the contents of Accumulator A.
     */
    CLRA() {
        this.accumulatorA = this.CLR();
    }

    /**
     * Clear Accumulator B
     * @description Clears the contents of Accumulator B.
     */
    CLRB() {
        this.accumulatorB = this.CLR();
    }

    /**
     * Clear Memory
     * @description Clears the contents of the operand.
     */
    CLRM() {
        this.WMB(this.addressRegister, this.CLR());
    }

    /**
     * Clear Overflow
     */
    CLV() {
        this.statusRegister.overflow = 0;
    }

    /**
     * Compare
     * @param {number} ARG 
     */
    CMP(ARG) {
        this._cc_CarryOverflow_NegativeZero(
            this.operand > ARG ? 1 : 0,
            this.calculateOverflowStatus(ARG, this.operand, ARG -= this.operand),
            ARG
        );
    }

    /**
     * Compare Accumulator A
     * @description Compares the contents of Accumulator A with the operand.
     */
    CMPA() {
        this.CMP(this.accumulatorA);
    }

    /**
     * Compare Accumulator B
     * @description Compares the contents of Accumulator B with the operand.
     */
    CMPB() {
        this.CMP(this.accumulatorB);
    }

    /**
     * Compliment, 1's
     * @param {number} ARG 
     * @returns {number}
     */
    COM(ARG) {
        return this._cc_CarryOverflow_NegativeZero(1, 0, ~ARG);
    }

    /**
     * Compliment, 1's Accumulator A
     * @description Performs a bitwise NOT operation on the contents of
     * Accumulator A.
     */
    COMA() {
        this.accumulatorA = this.COM(this.accumulatorA);
    }

    /**
     * Compliment, 1's Accumulator B
     * @description Performs a bitwise NOT operation on the contents of
     * Accumulator B.
     */
    COMB() {
        this.accumulatorB = this.COM(this.accumulatorB);
    }

    /**
     * Compliment, 1's Memory
     * @description Performs a bitwise NOT operation on the contents of the
     * operand.
     */
    COMM() {
        this.WMB(this.addressRegister, this.COM(this.operand));
    }

    /**
     * Compare Index Register
     * @returns {number}
     */
    CPX() {
        return this._cc_Overflow_NegativeZero(this.calculateOverflowStatus(this.indexRegister, this.operand, this.result = this.indexRegister - this.operand), this.result);
    }

    /**
     * Decimal Adjust Accumulator
     * @description Adjusts the contents of Accumulator A to form a valid
     * Binary Coded Decimal (BCD) number.
     */
    DAA() {
        const temp = this.accumulatorA;
        if (((temp & 0x0F) > 9) || this.statusRegister.half) {
            this.calculateOverflowStatus(temp, 0x06, this.accumulatorA += 0x06);
        }
        if ((((this.accumulatorA & 0xF0) >> 8) > 9) || this.statusRegister.carry) {
            this.calculateOverflowStatus(temp, 0x60, this.accumulatorA += 0x60);
        }
        if (((this.accumulatorA & 0x0F) > 9) && ((this.accumulatorA & 0xF0) == 0x90)) {
            this.calculateOverflowStatus(temp, 0x60, this.accumulatorA += 0x60);
        }
        if (((this.accumulatorA & 0xF0) >> 8) > 9) {
            this.statusRegister.carry = 1;
        }
        this.calculateNegativeStatus(this.accumulatorA);
        this.calculateZeroStatus(this.accumulatorA);
    }

    /**
     * Decrement
     * @param {number} ARG 
     * @returns {number}
     */
    DEC(ARG) {
        return this._cc_Overflow_NegativeZero(ARG - 0x80 ? 0 : 1, --ARG);
    }

    /**
     * Decrement Accumulator A
     * @description Decrements the contents of Accumulator A by one.
     */
    DECA() {
        this.accumulatorA = this.DEC(this.accumulatorA);
    }

    /**
     * Decrement Accumulator B
     * @description Decrements the contents of Accumulator B by one.
     */
    DECB() {
        this.accumulatorB = this.DEC(this.accumulatorB);
    }

    /**
     * Decrement Memory
     * @description Decrements the contents of the operand by one.
     */
    DECM() {
        this.WMB(this.addressRegister, this.DEC(this.operand));
    }

    /**
     * Decrement Stack Pointer
     * @description Decrements the contents of the stack pointer by one.
     */
    DES() {
        this.stackPointer = this.DEW(this.stackPointer);
    }

    /**
     * Decrement Word
     * @param {number} word 
     * @returns {number}
     */
    DEW(word) {
        return --word & 0xFFFF;
    }

    /**
     * Decrement Index Register
     * @description Decrements the contents of the index register by one.
     */
    DEX() {
        this.indexRegister = this.DEW(this.indexRegister);
        this.calculateZeroStatus(this.indexRegister);
    }

    /**
     * Exclusive OR
     * @param {number} ARG 
     * @returns {number}
     */
    EOR(ARG) {
        return this._cc_Overflow_NegativeZero(0, ARG ^ this.operand);
    }

    /**
     * Exclusive OR Accumulator A
     * @description Performs a bitwise XOR operation on the operand and
     * Accumulator A and stores the result in Accumulator A.
     */
    EORA() {
        this.accumulatorA = this.EOR(this.accumulatorA);
    }

    /**
     * Exclusive OR Accumulator B
     * @description Performs a bitwise XOR operation on the operand and
     * Accumulator B and stores the result in Accumulator B.
     */
    EORB() {
        this.accumulatorB = this.EOR(this.accumulatorB);
    }

    /**
     * Get Memory Byte
     * @returns {number}
     */
    GMB() {
        const value = this.RMB(this.programCounter);
        this.programCounter = this.INW(this.programCounter);
        return value;
    }

    /**
     * Get Memory Word
     * @returns {number}
     */
    GMW() {
        return this.GMB() << 8 | this.GMB();
    }

    /**
     * Halt
     * @param {1|0} level 
     */
    HALT(level = 0) {
        if (level === 1) {
            this.#halt = 1;
            this.fetchDecodeExecute();
        } else {
            this.#halt = 0;
        }
    }

    /**
     * Halt and Catch Fire
     * @description Stops the microprocessor and throws an error.
     */
    HCF() {
        const errorString = 'HCF - Undocumented Op-Code';
        alert(`${errorString} @ Program Counter ${this.programCounter.toString(16)}`);
        throw new Error(errorString);
    }

    /**
     * Increment
     * @param {number} ARG 
     * @returns {number}
     */
    INC(ARG) {
        return this._cc_Overflow_NegativeZero(ARG - 0x7F ? 0 : 1, ++ARG);
    }

    /**
     * Increment Accumulator A
     * @description Increments the contents of Accumulator A by one.
     */
    INCA() {
        this.accumulatorA = this.INC(this.accumulatorA);
    }

    /**
     * Increment Accumulator B
     * @description Increments the contents of Accumulator B by one.
     */
    INCB() {
        this.accumulatorB = this.INC(this.accumulatorB);
    }

    /**
     * Increment Memory
     * @description Increments the contents of the operand by one.
     */
    INCM() {
        this.WMB(this.addressRegister, this.INC(this.operand));
    }

    /**
     * Increment Stack Pointer
     * @description Increments the contents of the stack pointer by one.
     */
    INS() {
        this.stackPointer = this.INW(this.stackPointer);
    }

    /**
     * Interrupt
     * @param {number} vector 
     */
    INT(vector) {
        this.PSHW(this.programCounter);
        this.PSHW(this.indexRegister);
        this.PSHA();
        this.PSHB();
        this.PSH(this.getConditionCodeRegister());
        this.SEI();
        this.addressRegister = this.RMW(vector);
        this.JMP();
    }

    /**
     * Increment Index Register
     */
    INX() {
        this.indexRegister = this.INW(this.indexRegister);
        this.calculateZeroStatus(this.indexRegister);
    }

    /**
     * Increment Word
     * @param {number} word 
     * @returns {number}
     */
    INW(word) {
        return ++word & 0xFFFF;
    }

    /**
     * Invalid Operation
     */
    IOP() { }

    /**
     * Jump
     * @description Jumps to the address specified by the operand.
     */
    JMP() {
        this.programCounter = this.addressRegister;
    }

    /**
     * Jump to Subroutine
     * @description Pushes the current program counter onto the stack and then
     * jumps to the address specified by the operand.
     */
    JSR() {
        const to = this.addressRegister.toString(16).toUpperCase();
        const from = this.programCounter.toString(16).toUpperCase();
        if (to !== 'FDBB' && to !== 'FE02') {
            console.debug('JSR ' + to + ' from ' + from);
        }
        this.PSHW(this.programCounter);
        this.JMP();
    }

    /**
     * Load Accumulator A
     * @description Loads the operand into Accumulator A.
     */
    LDAA() {
        this.accumulatorA = this.ACC(this.operand);
    }

    /**
     * Load Accumulator B
     * @description Loads the operand into Accumulator B.
     */
    LDAB() {
        this.accumulatorB = this.ACC(this.operand);
    }

    /**
     * Load Stack Pointer
     * @description Loads the operand into the stack pointer.
     */
    LDS() {
        this.statusRegister.overflow = 0;
        this.statusRegister.negative = (this.operand >> 15) & 1;
        this.statusRegister.zero = this.operand ? 0 : 1;
        this.stackPointer = this.operand;
    }

    /**
     * Load Index Register
     * @description Loads the operand into the index register.
     */
    LDX() {
        this.statusRegister.overflow = 0;
        this.statusRegister.negative = (this.operand >> 15) & 1;
        this.statusRegister.zero = this.operand ? 0 : 1;
        this.indexRegister = this.operand;
    }

    /**
     * Logical Shift Right
     * @param {number} ARG 
     * @returns {number}
     */
    LSR(ARG) {
        return this._cc_Carry_NegativeOverflowZero(ARG & 1, ARG >> 1);
    }

    /**
     * Logical Shift Right Accumulator A
     * @description Shifts the bits of Accumulator A one position to the right.
     */
    LSRA() {
        this.accumulatorA = this.LSR(this.accumulatorA);
    }

    /**
     * Logical Shift Right Accumulator B
     * @description Shifts the bits of Accumulator B one position to the right.
     */
    LSRB() {
        this.accumulatorB = this.LSR(this.accumulatorB);
    }

    /**
     * Logical Shift Right Memory
     * @description Shifts the bits of the operand one position to the right.
     */
    LSRM() {
        this.WMB(this.addressRegister, this.LSR(this.operand));
    }

    /**
     * Negate
     * @param {number} ARG 
     * @returns {number}
     */
    NEG(ARG) {
        return this._cc_CarryOverflow_NegativeZero(ARG ? 1 : 0, ARG - 0x80 ? 0 : 1, -ARG);
    }

    /**
     * Negate Accumulator A
     * @description Negates the contents of Accumulator A.
     */
    NEGA() {
        this.accumulatorA = this.NEG(this.accumulatorA);
    }

    /**
     * Negate Accumulator B
     * @description Negates the contents of Accumulator B.
     */
    NEGB() {
        this.accumulatorB = this.NEG(this.accumulatorB);
    }

    /**
     * Negate Memory
     * @description Negates the contents of the operand.
     */
    NEGM() {
        this.WMB(this.addressRegister, this.NEG(this.operand));
    }

    /**
     * No Operation
     * @description Only cause Program Counter to Increment by One.
     */
    NOP() { }

    /**
     * Logical Inclusive OR
     * @param {number} ARG 
     * @returns {number}
     */
    ORA(ARG) {
        return this._cc_Overflow_NegativeZero(0, ARG | this.operand);
    }

    /**
     * Logical Inclusive OR Accumulator A
     * @description Performs a bitwise OR operation on the operand and
     * Accumulator A and stores the result in Accumulator A.
     */
    ORAA() {
        this.accumulatorA = this.ORA(this.accumulatorA);
    }

    /**
     * Logical Inclusive OR Accumulator B
     * @description Performs a bitwise OR operation on the operand and
     * Accumulator B and stores the result in Accumulator B.
     */
    ORAB() {
        this.accumulatorB = this.ORA(this.accumulatorB);
    }

    /**
     * Push
     * @param {number} ARG 
     */
    PSH(ARG) {
        const address = this.stackPointer;
        this.stackPointer = this.DEW(this.stackPointer);
        this.WMB(address, ARG);
    }

    /**
     * Push Accumulator A
     * @description Pushes the contents of Accumulator A onto the stack.
     */
    PSHA() {
        this.PSH(this.accumulatorA);
    }

    /**
     * Push Accumulator B
     * @description Pushes the contents of Accumulator B onto the stack.
     */
    PSHB() {
        this.PSH(this.accumulatorB);
    }

    /**
     * Push Word
     * @param {number} ARG 
     */
    PSHW(ARG) {
        this.PSH(ARG & 0xFF);
        this.PSH(ARG >> 8);
    }

    /**
     * Pull
     * @returns {number}
     */
    PUL() {
        this.stackPointer = this.INW(this.stackPointer);
        return this.RMB(this.stackPointer);
    }

    /**
     * Pull Accumulator A
     * @description Pulls the contents of the stack into Accumulator A.
     */
    PULA() {
        this.accumulatorA = this.PUL();
    }

    /**
     * Pull Accumulator B
     * @description Pulls the contents of the stack into Accumulator B.
     */
    PULB() {
        this.accumulatorB = this.PUL();
    }

    /**
     * Pull Word
     * @returns {number}
     */
    PULW() {
        return this.PUL() << 8 | this.PUL();
    }

    /**
     * Read Memory Byte
     * @param {number} address 
     * @returns {number}
     */
    RMB(address) {
        return this.memory.readByte(address);
    }

    /**
     * Read Memory Word
     * @param {number} address 
     * @returns {number}
     */
    RMW(address) {
        return (this.RMB(address) << 8) | (this.RMB(this.INW(address)));
    }

    /**
     * Rotate Left
     * @param {number} ARG 
     * @returns {number}
     */
    ROL(ARG) {
        return this._cc_Carry_NegativeOverflowZero((ARG >> 7) & 1, (ARG << 1) | this.statusRegister.carry);
    }

    /**
     * Rotate Left Accumulator A
     * @description Rotates the bits of Accumulator A one position to the left.
     */
    ROLA() {
        this.accumulatorA = this.ROL(this.accumulatorA);
    }

    /**
     * Rotate Left Accumulator B
     * @description Rotates the bits of Accumulator B one position to the left.
     */
    ROLB() {
        this.accumulatorB = this.ROL(this.accumulatorB);
    }

    /**
     * Rotate Left Memory
     * @description Rotates the bits of the operand one position to the left.
     */
    ROLM() {
        this.WMB(this.addressRegister, this.ROL(this.operand));
    }

    /**
     * Rotate Right
     * @param {number} ARG 
     * @returns {number}
     */
    ROR(ARG) {
        return this._cc_Carry_NegativeOverflowZero(ARG & 1, (ARG >> 1) | (this.statusRegister.carry << 7));
    }

    /**
     * Rotate Right Accumulator A
     * @description Rotates the bits of Accumulator A one position to the right.
     */
    RORA() {
        this.accumulatorA = this.ROR(this.accumulatorA);
    }

    /**
     * Rotate Right Accumulator B
     * @description Rotates the bits of Accumulator B one position to the right.
     */
    RORB() {
        this.accumulatorB = this.ROR(this.accumulatorB);
    }

    /**
     * Rotate Right Memory
     * @description Rotates the bits of the operand one position to the right.
     */
    RORM() {
        this.WMB(this.addressRegister, this.ROR(this.operand));
    }

    /**
     * Return from Interrupt
     */
    RTI() {
        this.setConditionCodeRegister(this.PUL());
        this.PULB();
        this.PULA();
        this.indexRegister = this.PULW();
        this.RTS();
    }

    /**
     * Return from Subroutine
     */
    RTS() {
        this.addressRegister = this.PULW();
        this.JMP();
    }

    /**
     * Subtract Accumulators
     * @description Subtracts the contents of Accumulator B from the contents of
     * Accumulator A and stores the result in Accumulator A.
     */
    SBA() {
        this.operand = this.accumulatorB;
        this.accumulatorA = this.SUB(this.accumulatorA);
    }

    /**
     * Subtract with Carry Accumulator A
     * @description Subtracts the operand from the contents of Accumulator A and
     * the carry flag and stores the result in Accumulator A.
     */
    SBCA() {
        this.accumulatorA = this.SUB(this.accumulatorA - this.statusRegister.carry);
    }

    /**
     * Subtract with Carry Accumulator B
     * @description Subtracts the operand from the contents of Accumulator B and
     * the carry flag and stores the result in Accumulator B.
     */
    SBCB() {
        this.accumulatorB = this.SUB(this.accumulatorB - this.statusRegister.carry);
    }

    /**
     * Set Carry
     * @description Sets the carry flag.
     */
    SEC() {
        this.statusRegister.carry = 1;
    }

    /**
     * Set Interrupt
     * @description Sets the interrupt flag.
     */
    SEI() {
        this.statusRegister.interrupt = 1;
    }

    /**
     * Set Overflow
     * @description Sets the overflow flag.
     */
    SEV() {
        this.statusRegister.overflow = 1;
    }

    /**
     * Set Memory Byte
     * @param {number} byte 
     */
    SMB(byte) {
        const address = this.programCounter;
        this.programCounter = this.INW(this.programCounter);
        this.WMB(address, byte);
    }

    /**
     * Store Accumulator A
     * @description Stores the contents of Accumulator A at the address specified
     * by the operand.
     */
    STAA() {
        this.WMB(this.addressRegister, this.ACC(this.accumulatorA));
    }

    /**
     * Store Accumulator B
     * @description Stores the contents of Accumulator B at the address specified
     * by the operand.
     */
    STAB() {
        this.WMB(this.addressRegister, this.ACC(this.accumulatorB));
    }

    /**
     * Store Stack Pointer
     * @description Stores the contents of the stack pointer at the address
     * specified by the operand.
     */
    STS() {
        this.WMW(this.addressRegister, this.stackPointer);
    }

    /**
     * Store Index Register
     * @description Stores the contents of the index register at the address
     * specified by the operand.
     */
    STX() {
        this.WMW(this.addressRegister, this.indexRegister);
    }

    /**
     * Subtract
     * @param {number} ARG 
     * @returns {number}
     */
    SUB(ARG) {
        return this._cc_CarryOverflow_NegativeZero(this.operand > ARG ? 1 : 0, this.calculateOverflowStatus(ARG, this.operand, this.result = ARG - this.operand), this.result);
    }

    /**
     * Subtract Accumulator A
     * @description Subtracts the operand from the contents of Accumulator A and
     * stores the result in Accumulator A.
     */
    SUBA() {
        this.accumulatorA = this.SUB(this.accumulatorA);
    }

    /**
     * Subtract Accumulator B
     * @description Subtracts the operand from the contents of Accumulator B and
     * stores the result in Accumulator B.
     */
    SUBB() {
        this.accumulatorB = this.SUB(this.accumulatorB);
    }

    /**
     * Software Interrupt
     * @description Triggers a software interrupt.
     */
    SWI() {
        console.debug(`SWI (PC ${this.programCounter})`);
        this.INT(Microprocessor.interruptVector.SWI);
    }

    /**
     * Transfer Accumulator A to Accumulator B
     * @description Transfers the contents of Accumulator A to Accumulator B.
     */
    TAB() {
        this.accumulatorB = this.ACC(this.accumulatorA);
    }

    /**
     * Transfer Accumulator A to Condition Code Register
     * @description Transfers the contents of Accumulator A to the condition code
     * register.
     */
    TAP() {
        this.setConditionCodeRegister(this.accumulatorA);
    }

    /**
     * Transfer Accumulator B to Accumulator A
     * @description Transfers the contents of Accumulator B to Accumulator A.
     */
    TBA() {
        this.accumulatorA = this.ACC(this.accumulatorB);
    }

    /**
     * Transfer Condition Code Register to Accumulator A
     * @description Transfers the contents of the condition code register to
     * Accumulator A.
     */
    TPA() {
        this.accumulatorA = this.getConditionCodeRegister();
    }

    /**
     * Test
     * @param {number} ARG 
     */
    TST(ARG) {
        this._cc_CarryOverflow_NegativeZero(0, 0, ARG);
    }

    /**
     * Test Accumulator A
     * @description Sets the condition code register based on the contents of
     * Accumulator A.
     */
    TSTA() {
        this.TST(this.accumulatorA);
    }

    /**
     * Test Accumulator B
     * @description Sets the condition code register based on the contents of
     * Accumulator B.
     */
    TSTB() {
        this.TST(this.accumulatorB);
    }

    /**
     * Test Memory
     * @description Sets the condition code register based on the contents of the
     * operand.
     */
    TSTM() {
        this.TST(this.operand);
    }

    /**
     * Transfer Stack Pointer to Index Register
     * @description Transfers the contents of the stack pointer to the index
     * register.
     */
    TSX() {
        this.indexRegister = this.INW(this.stackPointer);
    }

    /**
     * Transfer Index Register to Stack Pointer
     * @description Transfers the contents of the index register to the stack
     * pointer.
     */
    TXS() {
        this.stackPointer = this.DEW(this.indexRegister);
    }

    /**
     * Wait
     */
    WAI() {
        this.programCounter++;
        this.PSHW(this.programCounter);
        this.PSHW(this.indexRegister);
        this.PSHA();
        this.PSHB();
        this.PSH(this.getConditionCodeRegister());
    }

    /**
     * Write Memory Byte
     * @param {number} address 
     * @param {number} byte 
     */
    WMB(address, byte) {
        if (address >= 0xC110 && address <= 0xC16F) {
            const ledNumber = 5 - ((address - 0xC110) >> 4);
            const current = this.et3400.displayLeds[ledNumber];
            const shifted = 1 << (address & 0x07);
            const updated = (byte & 1) ? current | shifted : current & (255 - shifted);
            if (updated !== current) {
                this.et3400.displayLeds[ledNumber] = updated;
                globalThis.doDisplayUpdate = true;
            }
        }
        if (address < 0xD0) {
            console.debug(`write ${address.toString(16).toUpperCase()}: ${byte.toString(16).toUpperCase()}`);
            this.et3400.debugState();
        }
        this.memory.writeByte(address, byte);
    }

    /**
     * Write Memory Word
     * @param {number} address 
     * @param {number} word 
     */
    WMW(address, word) {
        this.WMB(address, word >> 8);
        this.WMB(this.INW(address), word & 0xFF);
    }
}
