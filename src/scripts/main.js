class PrintableProgramLine {
  constructor(address, opCode, operand, label, mnemonicInstruction, mnemonicOperand, comment = '') {
  
  }
}

class StatusRegister {
  #half; #interrupt; #negative; #zero; #overflow; #carry; #value;
  
  constructor(value = 0) {
    this.value = value;
  }
  
  get value() {
    return this.#value;
  }
  
  set value(number) {
    this.#value = number;
    this.#half = (number >> 5) & 1;
    this.#interrupt = (number >> 4) & 1;
    this.#negative = (number >> 3) & 1;
    this.#zero = (number >> 2) & 1;
    this.#overflow = (number >> 1) & 1; 
    this.#carry = number & 1;
  }
  
  #updateRegisterValue() {
    this.#value = (0xC0 | this.#half << 5 | this.#interrupt << 4 | this.#negative << 3 | this.#zero << 2 | this.#overflow << 1 | this.#carry);
  }
    
  get 0() { return this.#half; }
  set 0(value) { this.half = value; }
  get h() { return this.#half; }
  set h(value) { this.half = value; }
  get half() { return this.#half; }
  set half(value) {
    this.#half = Number(!!value);
    this.#updateRegisterValue();
  }
    
  get 1() { return this.#interrupt; }
  set 1(value) { this.interrupt = value; }
  get i() { return this.#interrupt; }
  set i(value) { this.interrupt = value; }
  get interrupt() { return this.#interrupt; }
  set interrupt(value) {
    this.#interrupt = Number(!!value);
    this.#updateRegisterValue();
  }
  
  get 2() { return this.#negative; }
  set 2(value) { this.negative = value; }
  get n() { return this.#negative; }
  set n(value) { this.negative = value; }
  get negative() { return this.#negative; }
  set negative(value) {
    this.#negative = Number(!!value);
    this.#updateRegisterValue();
  }
  
  get 3() { return this.#zero; }
  set 3(value) { this.zero = value; }
  get z() { return this.#zero; }
  set z(value) { this.zero = value; }
  get zero() { return this.#zero; }
  set zero(value) {
    this.#zero = Number(!!value);
    this.#updateRegisterValue();
  }
  
  get 4() { return this.#overflow; }
  set 4(value) { this.overflow = value; }
  get v() { return this.#overflow; }
  set v(value) { this.overflow = value; }
  get overflow() { return this.#overflow; }
  set overflow(value) {
    this.#overflow = Number(!!value);
    this.#updateRegisterValue();
  }
  
  get 5() { return this.#carry; }
  set 5(value) { this.carry = value; }
  get c() { return this.#carry; }
  set c(value) { this.carry = value; }
  get carry() { return this.#carry; }
  set carry(value) {
    this.#carry = Number(!!value);
    this.#updateRegisterValue();
  }
  
  get 6() { return 1; }
  set 6(value) { value = 1; }
  
  get 7() { return 1; }
  set 7(value) { value = 1; }
}

class Memory {
  #binary; #value;
  
  constructor(value = 0) {
    this.value = value;
  }
  
  get value() {
    return this.#value;
  }
  
  set value(number) {
    this.#value = number;
    const binary = number.toString(2);
    const fullByte = padLeft(binary, '0', 8);
    this.#binary = fullByte;
  }
  
  get "0"() { return this.#binary[7]; }
  get "1"() { return this.#binary[6]; }
  get "2"() { return this.#binary[5]; }
  get "3"() { return this.#binary[4]; }
  get "4"() { return this.#binary[3]; }
  get "5"() { return this.#binary[2]; }
  get "6"() { return this.#binary[1]; }
  get "7"() { return this.#binary[0]; }
  
  set "0"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 7)}${bit}`, 2);
  }
  set "1"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 6)}${bit}${this.#binary.substring(7)}`, 2);
  }
  set "2"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 5)}${bit}${this.#binary.substring(6)}`, 2);
  }
  set "3"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 4)}${bit}${this.#binary.substring(5)}`, 2);
  }
  set "4"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 3)}${bit}${this.#binary.substring(4)}`, 2);
  }
  set "5"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 2)}${bit}${this.#binary.substring(3)}`, 2);
  }
  set "6"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${this.#binary.substring(0, 1)}${bit}${this.#binary.substring(2)}`, 2);
  }
  set "7"(value = 1) { 
    const bit = !!value ? 1 : 0;
    this.value = parseInt(`${bit}${this.#binary.substring(1)}`, 2);
  }
}

class ReadOnlyMemory extends Memory {
  
}

class RandomAccessMemory extends Memory {
  
}

class Microprocessor {
  #fetchDecodeExecuteLoopTimer; #halt;
  
  static encodedInstructionMatrix = {
    default: 'SU9QAE5PUABJT1AASU9QAElPUABJT1AAVEFQAFRQQQBJTlgAREVYAENMVgBTRVYAQ0xDAFNFQwBDTEkAU0VJAFNCQQBDQkEASU9QAElPUABIQ0YASU9QAFRBQgBUQkEASU9QAERBQQBJT1AAQUJBAElPUABJT1AASU9QAElPUABKTVAASU9QAEJISQBCTFMAQkNDAEJDUwBCTkUAQkVRAEJWQwBCVlMAQlBMAEJNSQBCR0UAQkxUAEJHVABCTEUAVFNYAElOUwBQVUxBAFBVTEIAREVTAFRYUwBQU0hBAFBTSEIASU9QAFJUUwBJT1AAUlRJAElPUABJT1AAV0FJAFNXSQBORUdBAElPUABJT1AAQ09NQQBMU1JBAElPUABST1JBAEFTUkEAQVNMQQBST0xBAERFQ0EASU9QAElOQ0EAVFNUQQBJT1AAQ0xSQQBORUdCAElPUABJT1AAQ09NQgBMU1JCAElPUABST1JCAEFTUkIAQVNMQgBST0xCAERFQ0IASU9QAElOQ0IAVFNUQgBJT1AAQ0xSQgBORUcASU9QAElPUABDT00ATFNSAElPUABST1IAQVNSAEFTTABST0wAREVDAElPUABJTkMAVFNUAEpNUABDTFIATkVHAElPUABJT1AAQ09NAExTUgBJT1AAUk9SAEFTUgBBU0wAUk9MAERFQwBJT1AASU5DAFRTVABKTVAAQ0xSAFNVQkEAQ01QQQBTQkNBAElPUABBTkRBAEJJVEEATERBQQBIQ0YARU9SQQBBRENBAE9SQUEAQUREQQBDUFgAQlNSAExEUwBIQ0YAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASENGAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQQBDTVBBAFNCQ0EASU9QAEFOREEAQklUQQBMREFBAFNUQUEARU9SQQBBRENBAE9SQUEAQUREQQBDUFgASlNSAExEUwBTVFMAU1VCQgBDTVBCAFNCQ0IASU9QAEFOREIAQklUQgBMREFCAEhDRgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAEhDRgBTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABIQ0YATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWABTVUJCAENNUEIAU0JDQgBJT1AAQU5EQgBCSVRCAExEQUIAU1RBQgBFT1JCAEFEQ0IAT1JBQgBBRERCAElPUABJT1AATERYAFNUWA=='
  }
  
  
  static interruptVector = {
    IRQ: 0xFFF8,
    SWI: 0xFFFA,
    NMI: 0xFFFC,
    RST: 0xFFFE
  };
  
  constructor(encodedInstructionMatrix = Microprocessor.encodedInstructionMatrix.default) {
    this.accumulatorA = 0;
    this.accumulatorB = 0;
    this.statusRegister = new StatusRegister();
    
    this.programCounter = 0;
    this.stackPointer = 0;
    this.indexRegister = 0;
    this.addressRegister = 0;
    
    this.#fetchDecodeExecuteLoopTimer = 0;
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
    this.statusRegister.negative = ARG >> 7
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
    
  _cc__Carry(ARG, OPD, RES)	{
    this.statusRegister.carry = ((ARG = (ARG >> 7) & 1) & (OPD = (OPD >> 7) & 1)) | (OPD & (RES = ~((RES >> 7) & 1))) | (RES & ARG);
  }
  
  _cc__Half(ARG, OPD, RES)	{
    this.statusRegister.half = ((ARG = (ARG >> 3) & 1) & (OPD = (OPD >> 3) & 1)) | (OPD & (RES = ~((RES >> 3) & 1))) | (RES & ARG);
  }
  
  _cc__NegativeOverflowZero(ARG) {
    this.statusRegister.overflow = 0;
    this.statusRegister.negative = (ARG >> 15) & 1;
    this.statusRegister.zero = ARG ? 0 : 1;
    return ARG;
  }
  
  ABA() {
    OPD = this.accumulatorB;
    this.accumulatorA = this.ADD(this.accumulatorA);
  }
  
  ACC(ARG)	{
    return this._cc_Overflow_NegativeZero(0, ARG);
  }
  
  ADCA() {
    this.accumulatorA = this.ADD(this.accumulatorA + this.statusRegister.carry);
  }
  
  ADCB() {
    this.accumulatorB = this.ADD(this.accumulatorB + this.statusRegister.carry);
  }
  
  ADD(ARG) {
    return this._cc_Overflow_NegativeZero(this.calculateOverflowStatus(ARG, OPD, globalThis.RES = ARG + OPD), globalThis.RES, this._cc__Half(ARG, OPD, globalThis.RES), this._cc__Carry(ARG, OPD, globalThis.RES));
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
    return this._cc_Overflow_NegativeZero(0, ARG & OPD);
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
    this.WMB(this.addressRegister, this.ASL(OPD));
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
    this.WMB(this.addressRegister, this.ASR(OPD));
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
    OPD = this.accumulatorB;
    this.CMP(this.accumulatorA, OPD);
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
    this._cc_CarryOverflow_NegativeZero(OPD > ARG ? 1 : 0, this.calculateOverflowStatus(ARG, OPD, ARG -= OPD), ARG);
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
    this.WMB(this.addressRegister, this.COM(OPD));
  }
  
  CPX() {
    return this._cc_Overflow_NegativeZero(this.calculateOverflowStatus(this.indexRegister, OPD, RES = this.indexRegister - OPD), RES);
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
    this.WMB(this.addressRegister, this.DEC(OPD));
  }
  
  DES() {
    this.stackPointer = this.DEW(this.stackPointer);
  }
  
  DEW(word) {
    return --word & 0xFFFF;
  }
  
  DEX() {
    this.indexRegister = this.DEW(this.indexRegister)
    this.calculateZeroStatus(this.indexRegister);
  }
  
  EOR(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG ^ OPD);
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
      et3400.updateLedDisplay();
    }
    if (this.#halt === 0) {
      return;
    }
    for (CLK = 0; CLK < 20000; CLK += CYC[OPC]) {
      OPC = et3400.microprocessor.GMB();
      const func = DCD[OPC];
      if (typeof func === 'function') {
        OPD = func();
        et3400.microprocessor._lambda(OPC);
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
    EXIT("Undocumented Op-Code");
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
    this.WMB(this.addressRegister, this.INC(OPD));
  }

  INS() {
    this.stackPointer = this.INW(this.stackPointer);
  }
  
  INT(vector)	{
    this.PSHW(this.programCounter);
    this.PSHW(this.indexRegister);
    this.PSHA();
    this.PSHB();
    this.PSH(this.getConditionCodeRegister());
    this.SEI();
    this.JMP(this.addressRegister = this.RMW(vector));
  }

  INX() {
    this.indexRegister = this.INW(this.indexRegister)
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
    this.accumulatorA = this.ACC(OPD);
  }

  LDAB() {
    this.accumulatorB = this.ACC(OPD);
  }

  LDS() {
    this.stackPointer = this._cc__NegativeOverflowZero(OPD);
  }

  LDX() {
    this.indexRegister = this._cc__NegativeOverflowZero(OPD);
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
    this.WMB(this.addressRegister, this.LSR(OPD));
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
    this.WMB(this.addressRegister, this.NEG(OPD));
  }
  
  NOP() { }
  
  ORA(ARG) {
    return this._cc_Overflow_NegativeZero(0, ARG | OPD);
  }

  ORAA() {
    this.accumulatorA = this.ORA(this.accumulatorA);
  }

  ORAB() {
    this.accumulatorB = this.ORA(this.accumulatorB);
  }
  
  PSH(ARG)	{
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
    CLK = 0;
    this.accumulatorA = 0;
    this.accumulatorB = 0;
    this.indexRegister = 0;
    this.stackPointer = 0x00EB;
    this.setConditionCodeRegister(0x10);
    // Jump to position of Monitor Program
    this.addressRegister = this.RMW(Microprocessor.interruptVector.RST)
    this.JMP(this.addressRegister);
    this.HALT(1);
    this.fetchDecodeExecute();
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
    this.WMB(this.addressRegister, this.ROL(OPD));
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
    this.WMB(this.addressRegister, this.ROR(OPD));
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
    OPD = this.accumulatorB;
    this.accumulatorA = this.SUB(this.accumulatorA, this.accumulatorB);
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
    this.statusRegister.value = value
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
    return this._cc_CarryOverflow_NegativeZero(OPD > ARG ? 1 : 0, this.calculateOverflowStatus(ARG, OPD, RES = ARG - OPD), RES);
  }

  SUBA() {
    this.accumulatorA = this.SUB(this.accumulatorA);
  }

  SUBB() {
    this.accumulatorB = this.SUB(this.accumulatorB);
  }
  
   
  SWI() {
    console.debug(`SWI (PC ${this.programCounter})`)
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
  
  calculateOverflowStatus(ARG, OPD, RES) {
    return ((ARG = (ARG >> 7) & 1) & ~(OPD = (OPD >> 7) & 1) & ~(RES = (RES >> 7) & 1)) | (~ARG & OPD & RES);
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
    this.TST(OPD);
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
      const current = et3400.displayLeds[ledNumber];
      const shifted = 1 << (address & 0x07);
      const updated = (byte & 1) ? current | shifted : current & (255 - shifted);
      if (updated !== current) {
        et3400.displayLeds[ledNumber] = updated;
        doDisplayUpdate = true;
      }
    }
    if (address < 0xD0) {
      console.debug(`write ${address.toString(16).toUpperCase()}: ${byte.toString(16).toUpperCase()}`);
      et3400.debugState();
    }
    MEM[address] = byte;
  }
  
  WMW(address, word) {
    this.WMB(address, word >> 8);
    this.WMB(this.INW(address), word & 0xFF);
  }
}

class Et3400 {
  
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
      simulator:'#do'
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
      simulator:'#exam'
    },
    FWD:  {
      keyboardActivation: 'F',
      keyCode: 0x03,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector: '#button-fwd',
      simulator:'#fwd'
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
      simulator:'#auto'
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
      simulator:'#back'
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
      simulator:'#chan'
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
      simulator:'#rti'
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
      simulator:'#ss'
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
      simulator:'#br'
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
      simulator:'#index'
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
      simulator:'#cc'
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
      simulator:'#sp'
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
      simulator:'#acca'
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
      simulator:'#accb'
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
      simulator:'#pc'
    },
    ZERO: {
      keyboardActivation: '0',
      keyCode: 0x56,
      abortControllers: {
        click: null,
        keyUpDown: null,
        touchStartEnd: null
      },
      selector:  '#button-zero',
      simulator:'#zero'
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
      simulator:'#reset'
    }
  };
  
  constructor() {
    this.microprocessor = new Microprocessor();
    this.displayLeds = [0x00,	0x00,	0x00,	0x00,	0x00,	0x00];
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
    this.clearDisplayLeds()
    // Initialize Decoded Instruction Array
    globalThis.DCD = new Array(256);
    // Initialize Instruction Cycle Count Array
    globalThis.CYC = new Array(256);
    // Initialize Memory as a Zero-Filled aArray
    globalThis.MEM	= new Array(0x10000).fill(0);
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
      DCD[index] = AMD[CAM & 0x0F];
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
    globalThis.MEM	= new Array(0x10000);
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

const et3400 = new Et3400();

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
 *     Utility Functions
 *  ================================================= */
function pad(left = '', string = '', right = '') {
  return `${left}${string}${right}`;
}

function padLeft(string = '', character = '', length = 0) {
  const padLength = length - string.length;
  return padLength < 1
    ? string
    : pad(character.repeat(padLength), string);
}

function padByteBinary(number = 0) {
  if (typeof number === 'string') {
    number = Number.parseInt(number, 10);
  }
  const result = padLeft(number.toString(2), '0', 8);
  return result.length < 9 ? result : result.substr(-8);
}

function padWordHex(number = 0) {
  if (typeof number === 'string') {
    number = Number.parseInt(number, 10);
  }
  const result = padLeft(number.toString(16), '0', 4);
  return result.length < 5 ? result : result.substr(-4);
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

const AMD = [
  function invalidIllegal() {
    // Invalid
    return "Illegal";
  },
  function undocumented() {
    // Unknown
    return "Undocumented";
  },
  function reserved() {
    // Reserved
    return "Reserved";
  },
  function() {
    // Inherent
    return "Implied";
  },
  function relative() {
    OPD = et3400.microprocessor.GMB();
    const address =  et3400.microprocessor.programCounter + OPD - (OPD > 128 ? 256 : 0);
    et3400.microprocessor.addressRegister = et3400.microprocessor.ADDR(address)
    return OPD;
  },
  function indexedByteRead() {
    const address = et3400.microprocessor.ADDR(et3400.microprocessor.indexRegister + et3400.microprocessor.GMB());
    return et3400.microprocessor.RMB(address);
  },
  function indexedWordRead() {
    const address = et3400.microprocessor.ADDR(et3400.microprocessor.indexRegister + et3400.microprocessor.GMB());
    return et3400.microprocessor.RMW(address);
  },
  function indexedWordWrite() {
    et3400.microprocessor.addressRegister = et3400.microprocessor.ADDR(et3400.microprocessor.indexRegister + et3400.microprocessor.GMB());
    return "Implied";
  },
  function immediateByte() {
    const address = et3400.microprocessor.programCounter;
    return et3400.microprocessor.GMB(address);
  },
  function directByteRead() {
    const address = et3400.microprocessor.GMB();
    return et3400.microprocessor.RMB(address);
  },
  function directWordRead() {
    const address = et3400.microprocessor.GMB();
    return et3400.microprocessor.RMW(address);
  },
  function directWordWrite() {
    et3400.microprocessor.addressRegister = et3400.microprocessor.GMB();
    return "Implied";
  },
  function immediateWord() {
    const address = et3400.microprocessor.programCounter;
    return et3400.microprocessor.GMW(address);
  },
  function extendedByteRead() {
    const address = et3400.microprocessor.GMW();
    return et3400.microprocessor.RMB(address);
  },
  function extendedWordRead() {
    const address = et3400.microprocessor.GMW();
    return et3400.microprocessor.RMW(address);
  },
  function extendedWordWrite() {
    et3400.microprocessor.addressRegister = et3400.microprocessor.GMW();
    return "Implied";
  }
];

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
