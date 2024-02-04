import { StatusRegister } from './StatusRegister.js';

export class Microprocessor {
  #fetchDecodeExecuteLoopTimer; #halt;

  static encodedInstructionMatrix = {
    default: 'SU9QAE5PUABJT1AASU9QAElPUABJT1AAVEFQAFRQQQBJTlgAREVYAENMVgBTRVYAQ0xDAFNFQwBDTEkAU0VJAFNCQQBDQkEASU9QAElPUABIQ0YASU9QAFRBQgBUQkEASU9QAERBQQBJT1AAQUJBAElPUABJT1AASU9QAElPUABKTVAASU9QAEJISQBCTFMAQkNDAEJDUwBCTkUAQkVRAEJWQwBCVlMAQlBMAEJNSQBCR0UAQkxUAEJHVABCTEUAVFNYAElOUwBQVUxBAFBVTEIAREVTAFRYUwBQU0hBAFBTSEIASU9QAFJUUwBJT1AAUlRJAElPUABJT1AAV0FJAFNXSQBORUdBAElPUABJT1AAQ09NQQBMU1JBAElPUABST1JBAEFTUkEAQVNMQQBST0xBAERFQ0EASU9QAElOQ0EAVFNUQQBJT1AAQ0xSQQBORUdCAElPUABJT1AAQ09NQgBMU1JCAElPUABST1JCAEFTUkIAQVNMQgBST0xCAERFQ0IASU9QAElOQ0IAVFNUQgBJT1AAQ0xSQgBORUcASU9QAElPUABDT00ATFNSAElPUABST1IAQVNSAEFTTABST0wAREVDAElPUABJTkMAVFNUAEpNUABDTFIATkVHAElPUABJT1AAQ09NAExTUgBJT1AAUk9SAEFTUgBBU0wAUk9MAERFQwBJT1AASU5DAFRTVABKTVAAQ0xSAFNVQkEAQ01QQQBTQkNBAElPUABBTkRBAEJJVEEATERBQQBIQ0YARU9SQQBBRENBAE9SQUEAQUREQQBDUFgAQlNSAExEUwBIQ0YAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASENGAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQgBDTVBCAFNCQ0IASU9QAEFOREIAQklUQgBMREFCAEhDRgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAEhDRgBTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABIQ0YATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWA=='
  };


  static interruptVector = {
    IRQ: 0xFFF8,
    SWI: 0xFFFA,
    NMI: 0xFFFC,
    RST: 0xFFFE
  };

  constructor(et3400, encodedInstructionMatrix = Microprocessor.encodedInstructionMatrix.default) {
    this.accumulatorA = 0;
    this.accumulatorB = 0;
    this.operand = 0;
    this.programCounter = 0;
    this.stackPointer = 0;
    this.indexRegister = 0;
    this.addressRegister = 0;
    this.result = 0;
    this.et3400 = et3400;
    this.#fetchDecodeExecuteLoopTimer = 0;

    this.statusRegister = new StatusRegister();
    this.decodedInstructionNameLookup = atob(encodedInstructionMatrix).split('\x00');
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

  _cc__NegativeOverflowZero(ARG) {
    this.statusRegister.overflow = 0;
    this.statusRegister.negative = (ARG >> 15) & 1;
    this.statusRegister.zero = ARG ? 0 : 1;
    return ARG;
  }

  ABA() {
    this.operand = this.accumulatorB;
    this.accumulatorA = this.ADD(this.accumulatorA);
  }

  ACC(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG);
  }

  ADCA() {
    this.accumulatorA = this.ADD(this.accumulatorA + this.statusRegister.carry);
  }

  ADCB() {
    this.accumulatorB = this.ADD(this.accumulatorB + this.statusRegister.carry);
  }

  ADD(ARG) {
    return this._cc_Overflow_NegativeZero(this.calculateOverflowStatus(ARG, this.operand, this.result = ARG + this.operand), this.result, this._cc__Half(ARG, this.operand, this.result), this._cc__Carry(ARG, this.operand, this.result));
  }

  ADDA() {
    this.accumulatorA = this.ADD(this.accumulatorA);
  }

  ADDB() {
    this.accumulatorB = this.ADD(this.accumulatorB);
  }

  ADDR(word) {
    return word & 0xFFFF;
  }

  AND(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG & this.operand);
  }

  ANDA() {
    this.accumulatorA = this.AND(this.accumulatorA);
  }

  ANDB() {
    this.accumulatorB = this.AND(this.accumulatorB);
  }

  ASL(ARG) {
    return this._cc_Carry_NegativeOverflowZero((ARG >> 7) & 1, ARG << 1);
  }

  ASLA() {
    this.accumulatorA = this.ASL(this.accumulatorA);
  }

  ASLB() {
    this.accumulatorB = this.ASL(this.accumulatorB);
  }

  ASLM() {
    this.WMB(this.addressRegister, this.ASL(this.operand));
  }

  ASR(ARG) {
    return this._cc_Carry_NegativeOverflowZero(ARG & 1, (ARG >> 1) | (ARG & 0x80));
  }

  ASRA() {
    this.accumulatorA = this.ASR(this.accumulatorA);
  }

  ASRB() {
    this.accumulatorB = this.ASR(this.accumulatorB);
  }

  ASRM() {
    this.WMB(this.addressRegister, this.ASR(this.operand));
  }

  BCC() {
    this.BRA(!this.statusRegister.carry);
  }

  BCS() {
    this.BRA(this.statusRegister.carry);
  }

  BEQ() {
    this.BRA(this.statusRegister.zero);
  }

  BGE() {
    this.BRA(!(this.statusRegister.negative ^ this.statusRegister.overflow));
  }

  BGT() {
    this.BRA(!(this.statusRegister.zero | (this.statusRegister.negative ^ this.statusRegister.overflow)));
  }

  BHI() {
    this.BRA(!(this.statusRegister.carry | this.statusRegister.zero));
  }

  BITA() {
    this.AND(this.accumulatorA);
  }

  BITB() {
    this.AND(this.accumulatorB);
  }

  BLE() {
    this.BRA(this.statusRegister.zero | (this.statusRegister.negative ^ this.statusRegister.overflow));
  }

  BLS() {
    this.BRA(this.statusRegister.carry | this.statusRegister.zero);
  }

  BLT() {
    this.BRA(this.statusRegister.negative ^ this.statusRegister.overflow);
  }

  BMI() {
    this.BRA(this.statusRegister.negative);
  }

  BNE() {
    this.BRA(!this.statusRegister.zero);
  }

  BPL() {
    this.BRA(!this.statusRegister.negative);
  }

  BRA(CC) {
    if (CC) {
      this.JMP();
    }
  }

  BSR() {
    this.JSR();
  }

  BVC() {
    this.BRA(!this.statusRegister.overflow);
  }

  BVS() {
    this.BRA(this.statusRegister.overflow);
  }

  CBA() {
    this.operand = this.accumulatorB;
    this.CMP(this.accumulatorA);
  }

  CLC() {
    this.statusRegister.carry = 0;
  }

  CLI() {
    this.statusRegister.interrupt = 0;
  }

  CLR() {
    this.statusRegister.carry = 0;
    return this._cc_Overflow_NegativeZero(0, 0);
  }

  CLRA() {
    this.accumulatorA = this.CLR();
  }

  CLRB() {
    this.accumulatorB = this.CLR();
  }

  CLRM() {
    this.WMB(this.addressRegister, this.CLR());
  }

  CLV() {
    this.statusRegister.overflow = 0;
  }

  CMP(ARG) {
    this._cc_CarryOverflow_NegativeZero(this.operand > ARG ? 1 : 0, this.calculateOverflowStatus(ARG, this.operand, ARG -= this.operand), ARG);
  }

  CMPA() {
    this.CMP(this.accumulatorA);
  }

  CMPB() {
    this.CMP(this.accumulatorB);
  }

  COM(ARG) {
    return this._cc_CarryOverflow_NegativeZero(1, 0, ~ARG);
  }

  COMA() {
    this.accumulatorA = this.COM(this.accumulatorA);
  }

  COMB() {
    this.accumulatorB = this.COM(this.accumulatorB);
  }

  COMM() {
    this.WMB(this.addressRegister, this.COM(this.operand));
  }

  CPX() {
    return this._cc_Overflow_NegativeZero(this.calculateOverflowStatus(this.indexRegister, this.operand, this.result = this.indexRegister - this.operand), this.result);
  }

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

  DEB(byte) {
    return --byte & 0xFF;
  }

  DEC(ARG) {
    return this._cc_Overflow_NegativeZero(ARG - 0x80 ? 0 : 1, --ARG);
  }

  DECA() {
    this.accumulatorA = this.DEC(this.accumulatorA);
  }

  DECB() {
    this.accumulatorB = this.DEC(this.accumulatorB);
  }

  DECM() {
    this.WMB(this.addressRegister, this.DEC(this.operand));
  }

  DES() {
    this.stackPointer = this.DEW(this.stackPointer);
  }

  DEW(word) {
    return --word & 0xFFFF;
  }

  DEX() {
    this.indexRegister = this.DEW(this.indexRegister);
    this.calculateZeroStatus(this.indexRegister);
  }

  EOR(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG ^ this.operand);
  }

  EORA() {
    this.accumulatorA = this.EOR(this.accumulatorA);
  }

  EORB() {
    this.accumulatorB = this.EOR(this.accumulatorB);
  }

  fetchDecodeExecute() {
    if (this.#fetchDecodeExecuteLoopTimer) {
      window.clearTimeout(this.#fetchDecodeExecuteLoopTimer);
    }
    if (doDisplayUpdate) {
      this.et3400.updateLedDisplay();
    }
    if (this.#halt === 0) {
      return;
    }
    let opcode = 0;
    for (let clock = 0; clock < 20000; clock += CYC[opcode]) {
      opcode = this.et3400.microprocessor.GMB();
      const func = DCD[opcode];
      if (typeof func === 'function') {
        this.operand = func();
        this.et3400.microprocessor._lambda(opcode);
      }
    }
    this.#fetchDecodeExecuteLoopTimer = window.setTimeout(() => this.fetchDecodeExecute(), 50);
  }

  getConditionCodeRegister() {
    return this.statusRegister.value & 0xFF;
  }

  GMB() {
    const value = this.RMB(this.programCounter);
    this.programCounter = this.INW(this.programCounter);
    return value;
  }

  GMW() {
    return this.GMB() << 8 | this.GMB();
  }

  HALT(level = 0) {
    if (level === 1) {
      this.#halt = 1;
      this.fetchDecodeExecute();
    } else {
      this.#halt = 0;
    }
  }

  HCF() {
    const errorString = 'HCF - Undocumented Op-Code';
    alert(`${errorString} @ Program Counter ${this.programCounter.toString(16)}`);
    throw new Error(errorString);
  }

  INB(byte) {
    return ++byte & 0xFF;
  }

  INC(ARG) {
    return this._cc_Overflow_NegativeZero(ARG - 0x7F ? 0 : 1, ++ARG);
  }

  INCA() {
    this.accumulatorA = this.INC(this.accumulatorA);
  }

  INCB() {
    this.accumulatorB = this.INC(this.accumulatorB);
  }

  INCM() {
    this.WMB(this.addressRegister, this.INC(this.operand));
  }

  INS() {
    this.stackPointer = this.INW(this.stackPointer);
  }

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

  INX() {
    this.indexRegister = this.INW(this.indexRegister);
    this.calculateZeroStatus(this.indexRegister);
  }

  JMP() {
    this.programCounter = this.addressRegister;
  }

  JSR() {
    this.PSHW(this.programCounter);
    this.JMP();
  }

  INW(word) {
    return ++word & 0xFFFF;
  }

  IOP() { }

  LDAA() {
    this.accumulatorA = this.ACC(this.operand);
  }

  LDAB() {
    this.accumulatorB = this.ACC(this.operand);
  }

  LDS() {
    this.stackPointer = this._cc__NegativeOverflowZero(this.operand);
  }

  LDX() {
    this.indexRegister = this._cc__NegativeOverflowZero(this.operand);
  }

  LSR(ARG) {
    return this._cc_Carry_NegativeOverflowZero(ARG & 1, ARG >> 1);
  }

  LSRA() {
    this.accumulatorA = this.LSR(this.accumulatorA);
  }

  LSRB() {
    this.accumulatorB = this.LSR(this.accumulatorB);
  }

  LSRM() {
    this.WMB(this.addressRegister, this.LSR(this.operand));
  }

  NEG(ARG) {
    return this._cc_CarryOverflow_NegativeZero(ARG ? 1 : 0, ARG - 0x80 ? 0 : 1, -ARG);
  }

  NEGA() {
    this.accumulatorA = this.NEG(this.accumulatorA);
  }

  NEGB() {
    this.accumulatorB = this.NEG(this.accumulatorB);
  }

  NEGM() {
    this.WMB(this.addressRegister, this.NEG(this.operand));
  }

  NOP() { }

  ORA(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG | this.operand);
  }

  ORAA() {
    this.accumulatorA = this.ORA(this.accumulatorA);
  }

  ORAB() {
    this.accumulatorB = this.ORA(this.accumulatorB);
  }

  PSH(ARG) {
    const address = this.stackPointer;
    this.stackPointer = this.DEW(this.stackPointer);
    this.WMB(address, ARG);
  }

  PSHA() {
    this.PSH(this.accumulatorA);
  }

  PSHB() {
    this.PSH(this.accumulatorB);
  }

  PSHW(ARG) {
    this.PSH(ARG & 0xFF);
    this.PSH(ARG >> 8);
  }

  PUL() {
    this.stackPointer = this.INW(this.stackPointer);
    return this.RMB(this.stackPointer);
  }

  PULA() {
    this.accumulatorA = this.PUL();
  }

  PULB() {
    this.accumulatorB = this.PUL();
  }

  PULW() {
    return this.PUL() << 8 | this.PUL();
  }

  reset() {
    this.HALT(0);
    this.WMB(0xC003, 0xFF);
    this.WMB(0xC005, 0xFF);
    this.WMB(0xC006, 0xFF);
    this.accumulatorA = 0;
    this.accumulatorB = 0;
    this.indexRegister = 0;
    this.stackPointer = 0x00EB;
    this.setConditionCodeRegister(0x10);
    // Jump to position of Monitor Program
    this.addressRegister = this.RMW(Microprocessor.interruptVector.RST);
    this.JMP();
    this.HALT(1);
  }

  RMB(address) {
    return MEM[address];
  }

  RMW(address) {
    return this.RMB(address) << 8 | this.RMB(this.INW(address));
  }

  ROL(ARG) {
    return this._cc_Carry_NegativeOverflowZero((ARG >> 7) & 1, (ARG << 1) | this.statusRegister.carry);
  }

  ROLA() {
    this.accumulatorA = this.ROL(this.accumulatorA);
  }

  ROLB() {
    this.accumulatorB = this.ROL(this.accumulatorB);
  }

  ROLM() {
    this.WMB(this.addressRegister, this.ROL(this.operand));
  }

  ROR(ARG) {
    return this._cc_Carry_NegativeOverflowZero(ARG & 1, (ARG >> 1) | (this.statusRegister.carry << 7));
  }

  RORA() {
    this.accumulatorA = this.ROR(this.accumulatorA);
  }

  RORB() {
    this.accumulatorB = this.ROR(this.accumulatorB);
  }

  RORM() {
    this.WMB(this.addressRegister, this.ROR(this.operand));
  }

  RTI() {
    this.setConditionCodeRegister(this.PUL());
    this.PULB();
    this.PULA();
    this.indexRegister = this.PULW();
    this.RTS();
  }

  RTS() {
    this.addressRegister = this.PULW();
    this.JMP();
  }

  SBA() {
    this.operand = this.accumulatorB;
    this.accumulatorA = this.SUB(this.accumulatorA);
  }

  SBCA() {
    this.accumulatorA = this.SUB(this.accumulatorA - this.statusRegister.carry);
  }

  SBCB() {
    this.accumulatorB = this.SUB(this.accumulatorB - this.statusRegister.carry);
  }

  SEC() {
    this.statusRegister.carry = 1;
  }

  SEI() {
    this.statusRegister.interrupt = 1;
  }

  setConditionCodeRegister(value) {
    this.statusRegister.value = value;
  }

  SEV() {
    this.statusRegister.overflow = 1;
  }

  SMB(byte) {
    const address = this.programCounter;
    this.programCounter = this.INW(this.programCounter);
    this.WMB(address, byte);
  }

  STAA() {
    this.WMB(this.addressRegister, this.ACC(this.accumulatorA));
  }

  STAB() {
    this.WMB(this.addressRegister, this.ACC(this.accumulatorB));
  }

  STS() {
    this.WMW(this.addressRegister, this.stackPointer);
  }

  STX() {
    this.WMW(this.addressRegister, this.indexRegister);
  }

  SUB(ARG) {
    return this._cc_CarryOverflow_NegativeZero(this.operand > ARG ? 1 : 0, this.calculateOverflowStatus(ARG, this.operand, this.result = ARG - this.operand), this.result);
  }

  SUBA() {
    this.accumulatorA = this.SUB(this.accumulatorA);
  }

  SUBB() {
    this.accumulatorB = this.SUB(this.accumulatorB);
  }


  SWI() {
    console.debug(`SWI (PC ${this.programCounter})`);
    this.INT(Microprocessor.interruptVector.SWI);
  }

  TAB() {
    this.accumulatorB = this.ACC(this.accumulatorA);
  }

  TAP() {
    this.setConditionCodeRegister(this.accumulatorA);
  }

  TBA() {
    this.accumulatorA = this.ACC(this.accumulatorB);
  }

  calculateNegativeStatus(ARG) {
    this.statusRegister.negative = (ARG >> 7) & 1;
  }

  calculateOverflowStatus(ARG, operand, RES) {
    return ((ARG = (ARG >> 7) & 1) & ~ (operand = (operand >> 7) & 1) & ~(RES = (RES >> 7) & 1)) | (~ARG & operand & RES);
  }

  calculateZeroStatus(ARG) {
    this.statusRegister.zero = ARG ? 0 : 1;
  }

  TPA() {
    this.accumulatorA = this.getConditionCodeRegister();
  }

  TST(ARG) {
    this._cc_CarryOverflow_NegativeZero(0, 0, ARG);
  }

  TSTA() {
    this.TST(this.accumulatorA);
  }

  TSTB() {
    this.TST(this.accumulatorB);
  }

  TSTM() {
    this.TST(this.operand);
  }

  TSX() {
    this.indexRegister = this.INW(this.stackPointer);
  }

  TXS() {
    this.stackPointer = this.DEW(this.indexRegister);
  }


  WAI() {
    this.programCounter++;
    this.PSHW(this.programCounter);
    this.PSHW(this.indexRegister);
    this.PSHA();
    this.PSHB();
    this.PSH(this.getConditionCodeRegister());
  }

  WMB(address, byte) {
    if (address >= 0xC110 && address <= 0xC16F) {
      const ledNumber = 5 - ((address - 0xC110) >> 4);
      const current = this.et3400.displayLeds[ledNumber];
      const shifted = 1 << (address & 0x07);
      const updated = (byte & 1) ? current | shifted : current & (255 - shifted);
      if (updated !== current) {
        this.et3400.displayLeds[ledNumber] = updated;
        doDisplayUpdate = true;
      }
    }
    if (address < 0xD0) {
      console.debug(`write ${address.toString(16).toUpperCase()}: ${byte.toString(16).toUpperCase()}`);
      this.et3400.debugState();
    }
    MEM[address] = byte;
  }

  WMW(address, word) {
    this.WMB(address, word >> 8);
    this.WMB(this.INW(address), word & 0xFF);
  }
}
