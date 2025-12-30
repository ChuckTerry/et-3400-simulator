import { Memory } from './Memory.js';

export class ReadOnlyMemory extends Memory {
    constructor(size = 0xFFFF, contentArray = new Array(size).fill(0)) {
        const sizeDifference = contentArray.length - size;
        if (sizeDifference > 0) {
            contentArray = contentArray.slice(0, sizeDifference);
            console.warn(`ROM content truncated to ${size} bytes`);
        } else if (sizeDifference < 0) {
            contentArray = contentArray.concat(new Array(-sizeDifference).fill(0));
        }
        super();
        this.content = contentArray;
    }

    clear() {
        console.warn('Attempt to clear ROM, Nothing cleared');
    }

    writeByte(address) {
        console.warn(`Attempt to write to ROM at address ${address.toString(16).toUpperCase()}, Nothing written`);
    }
}
