export class StatusRegister {
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
