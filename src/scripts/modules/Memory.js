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
     * Loads A hex string into memory.  Accepts two forms, one with a starting address, another without:
     * `0000 0123456789ABCDEF`
     * `0123456789ABCDEF`
     * @param {string} Hex Loader String
     */
    loadHexString(string) {
        const loadArray = string.split(' ');
        if (loadArray.length === 1) {
            loadArray.unshift(0);
        }
        console.dir(loadArray);
        const startAddress = parseInt(loadArray[0], 16);
        const byteArray = loadArray[1].match(/.{1,2}/g);
        const bytes = byteArray.length;
        for (let index = 0; index < bytes; index++) {
            this.content[startAddress + index] = parseInt(byteArray[index], 16);
        }
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
        if (address > 0xFC00) {
            console.error(`Failed to write ${content.toString(16).toUpperCase()} to ROM address ${address.toString(16).toUpperCase()}`);
        } else {
            this.content[address] = content;
        }
    }
}

