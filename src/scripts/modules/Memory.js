/**
 * Memory class
 */
export class Memory {

  /**
   * @constructor
   * @param {number} size The size of the memory space
   * @param {number[]} contentArray The initial content of the memory space
   */
  constructor(size = 0xFFFF, contentArray = new Array(size).fill(0)) {
    this.content = contentArray;
  }

  /**
   * Clear the memory space by filling it with 0s
   */
  clear() {
    this.content.fill(0);
  }

  /**
   * Read a byte from the memory space
   * @param {number} address The address to read from
   * @returns {number} The byte at the given address
   */
  readByte(address) {
    return this.content[address];
  }

  /**
   * Write a byte to the memory space
   * @param {number} address The address to write to
   * @param {number} content The content to write
   */
  writeByte(address, content) {
    this.content[address] = content;
  }
}
