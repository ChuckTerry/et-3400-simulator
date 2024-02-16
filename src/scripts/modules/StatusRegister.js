/**
 * Represents the status register of the Microprocessor.
 */
export class StatusRegister {
  #half; #interrupt; #negative; #zero; #overflow; #carry; #value;

  /**
   * @constructor
   * @param {number} value the initial value of the register.
   */
  constructor(value = 0) {
    this.value = value;
  }

  /**
   * @getter
   * @returns {number} the value of the register.
   */
  get value() {
    return this.#value;
  }

  /**
   * @setter
   * @param {number} number the new value of the register.
   */
  set value(number) {
    this.#value = number;
    this.#half = (number >> 5) & 1;
    this.#interrupt = (number >> 4) & 1;
    this.#negative = (number >> 3) & 1;
    this.#zero = (number >> 2) & 1;
    this.#overflow = (number >> 1) & 1;
    this.#carry = number & 1;
  }

  /**
   * @private
   * Updates the value of the register.
   * Called internally when a flag is changed.
   */
  #updateRegisterValue() {
    this.#value = (0xC0 | this.#half << 5 | this.#interrupt << 4 | this.#negative << 3 | this.#zero << 2 | this.#overflow << 1 | this.#carry);
  }

  /** @alias half */ get 0() { return this.#half; }
  /** @alias half */ set 0(value) { this.half = value; }
  /** @alias half */ get h() { return this.#half; }
  /** @alias half */ set h(value) { this.half = value; }

  /**
   * @getter
   * @returns {number} the half-carry flag.
   */
  get half() { return this.#half; }

  /**
   * @setter
   * @param {number} value the new value of the half-carry flag.
   */
  set half(value) {
    this.#half = Number(!!value);
    this.#updateRegisterValue();
  }

  /** @alias interrupt */ get 1() { return this.#interrupt; }
  /** @alias interrupt */ set 1(value) { this.interrupt = value; }
  /** @alias interrupt */ get i() { return this.#interrupt; }
  /** @alias interrupt */ set i(value) { this.interrupt = value; }

  /**
   * @getter
   * @returns {number} the interrupt flag.
   */
  get interrupt() { return this.#interrupt; }
  set interrupt(value) {
    this.#interrupt = Number(!!value);
    this.#updateRegisterValue();
  }

  /** @alias negative */ get 2() { return this.#negative; }
  /** @alias negative */ set 2(value) { this.negative = value; }
  /** @alias negative */ get n() { return this.#negative; }
  /** @alias negative */ set n(value) { this.negative = value; }

  /**
   * @getter
   * @returns {number} the negative flag.
   */
  get negative() { return this.#negative; }

  /**
   * @setter
   * @param {number} value the new value of the negative flag.
   */
  set negative(value) {
    this.#negative = Number(!!value);
    this.#updateRegisterValue();
  }

  /** @alias zero */ get 3() { return this.#zero; }
  /** @alias zero */ set 3(value) { this.zero = value; }
  /** @alias zero */ get z() { return this.#zero; }
  /** @alias zero */ set z(value) { this.zero = value; }

  /**
   * @getter
   * @returns {number} the zero flag.
   */
  get zero() { return this.#zero; }

  /**
   * @setter
   * @param {number} value the new value of the zero flag.
   */
  set zero(value) {
    this.#zero = Number(!!value);
    this.#updateRegisterValue();
  }

  /** @alias overflow */ get 4() { return this.#overflow; }
  /** @alias overflow */ set 4(value) { this.overflow = value; }
  /** @alias overflow */ get v() { return this.#overflow; }
  /** @alias overflow */ set v(value) { this.overflow = value; }

  /**
   * @getter
   * @returns {number} the overflow flag.
   */
  get overflow() { return this.#overflow; }

  /**
   * @setter
   * @param {number} value the new value of the overflow flag.
   */
  set overflow(value) {
    this.#overflow = Number(!!value);
    this.#updateRegisterValue();
  }

  /** @alias carry */ get 5() { return this.#carry; }
  /** @alias carry */ set 5(value) { this.carry = value; }
  /** @alias carry */ get c() { return this.#carry; }
  /** @alias carry */ set c(value) { this.carry = value; }

  /**
   * @getter
   * @returns {number} the carry flag.
   */
  get carry() { return this.#carry; }

  /**
   * @setter
   * @param {number} value the new value of the carry flag.
   */
  set carry(value) {
    this.#carry = Number(!!value);
    this.#updateRegisterValue();
  }

  /**
   * @getter
   * @returns {number} the 6th bit (Always 1).
   */
  get 6() { return 1; }

  /**
   * @setter
   * @param {number} value Unused.
   */
  set 6(value) { value = 1; }

  /**
   * @getter
   * @returns {number} the 7th bit (Always 1).
   */
  get 7() { return 1; }

  /**
   * @setter
   * @param {number} value Unused.
   */
  set 7(value) { value = 1; }
}
