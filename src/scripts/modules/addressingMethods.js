export function contstructAddressingMethodTable(microprocessor) {
  const addressingMethods = [
    function invalidIllegal() {
      return 'Illegal';
    },
    function undocumented() {
      return 'Undocumented';
    },
    function reserved() {
      return 'Reserved';
    },
    function inherent() {
      return 'Implied';
    },
    function relative() {
      OPD = microprocessor.GMB();
      const address = microprocessor.programCounter + OPD - (OPD > 128 ? 256 : 0);
      microprocessor.addressRegister = microprocessor.ADDR(address);
      return OPD;
    },
    function indexedByteRead() {
      const address = microprocessor.ADDR(microprocessor.indexRegister + microprocessor.GMB());
      return microprocessor.RMB(address);
    },
    function indexedWordRead() {
      const address = microprocessor.ADDR(microprocessor.indexRegister + microprocessor.GMB());
      return microprocessor.RMW(address);
    },
    function indexedWordWrite() {
      microprocessor.addressRegister = microprocessor.ADDR(microprocessor.indexRegister + microprocessor.GMB());
      return "Implied";
    },
    function immediateByte() {
      const address = microprocessor.programCounter;
      return microprocessor.GMB(address);
    },
    function directByteRead() {
      const address = microprocessor.GMB();
      return microprocessor.RMB(address);
    },
    function directWordRead() {
      const address = microprocessor.GMB();
      return microprocessor.RMW(address);
    },
    function directWordWrite() {
      microprocessor.addressRegister = microprocessor.GMB();
      return 'Implied';
    },
    function immediateWord() {
      const address = microprocessor.programCounter;
      return microprocessor.GMW(address);
    },
    function extendedByteRead() {
      const address = microprocessor.GMW();
      return microprocessor.RMB(address);
    },
    function extendedWordRead() {
      const address = microprocessor.GMW();
      return microprocessor.RMW(address);
    },
    function extendedWordWrite() {
      microprocessor.addressRegister = microprocessor.GMW();
      return 'Implied';
    }
  ];
  return addressingMethods;
}
