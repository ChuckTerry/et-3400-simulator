export class Memory {

  constructor(size = 0xFFFF, contentArray = new Array(size).fill(0)) {
    this.content = contentArray;
  }

  clear() {
    this.content.fill(0);
  }

  readByte(address) {
    return this.content[address];
  }

  writeByte(address, content) {
    this.content[address] = content;
  }
}
