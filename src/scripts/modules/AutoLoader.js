import { keypad } from './keypad.js';

const svgElementMap = {
    '0': '#zero',
    '1': '#acca',
    '2': '#accb',
    '3': '#pc',
    '4': '#index',
    '5': '#cc',
    '6': '#sp',
    '7': '#rti',
    '8': '#ss',
    '9': '#br',
    'A': '#auto',
    'B': '#back',
    'C': '#chan',
    'D': '#do',
    'E': '#exam',
    'F': '#fwd',
    'ESCAPE': '#reset'
};

export class AutoLoader {
    constructor(et3400) {
        this.et3400 = et3400;
        this.clearState = false;
        this.keyMap = Object.fromEntries(Object.keys(keypad).map((key) => {
            return [keypad[key].keyboardActivation, keypad[key].keyCode];
        }));
        this.elementMap = Object.fromEntries(Object.keys(keypad).map((key) => {
            const keyChar = keypad[key].keyboardActivation;
            return [keyChar, document.querySelector(svgElementMap[keyChar])];
        }));
    }

    loadProgram(program, step = -1) {
        if (program.length === 0) {
            if (this.clearState !== false) {
                return this.clearProgram(this.clearState);
            }
            return;
        }

        if (step < 1) {
            if (step === -1) {
                this.et3400.pressKey(this.keyMap['ESCAPE']);
                const split = program.split(' ');
                if (split.length === 1) {
                    program = `A0000${split[0]}`;
                } else {
                    program = `A${split[0]}${split[1]}`;
                }
                window.setTimeout(() => {
                    this.loadProgram(program, step + 1);
                }, 250);
            } else {
                this.et3400.releaseKey(this.keyMap['ESCAPE']);
                window.setTimeout(() => {
                    this.loadProgram(program, step + 1);
                }, 50);
            }
            return;
        }
        const character = program[0];
        const key = this.keyMap[character];
        const element = this.elementMap[character];
        const isPress = step % 2 === 1;
        if (isPress) {
            this.et3400.pressKey(key);
            element.classList.add('autoload');
        } else {
            this.et3400.releaseKey(key);
            element.classList.remove('autoload');
            program = program.slice(1);
        }
        window.setTimeout(() => {
            this.loadProgram(program, step + 1);
        }, isPress ? 200 : 50);
    }

    clearProgram(replacement = 0x01) {
        if (this.clearState === false) {
            replacement = (replacement & 0xFF).toString(16).toUpperCase().padStart(2, '0');
            const programLo = `0000 ${replacement.repeat(0xCA)}`;
            this.clearState = replacement;
            this.loadProgram(programLo);
        } else {
            this.clearState = false;
            const programHi = `0100 ${replacement.repeat(0xFF)}`;
            this.loadProgram(programHi);
        }
    }
}
