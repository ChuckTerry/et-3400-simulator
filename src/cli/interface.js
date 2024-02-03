import * as readline from'node:readline';
import { stdin, stdout } from 'node:process';
import { KEYCODE_ENUM } from './enum/KEYCODE.js';
import { KEYCHAR_ENUM } from './enum/KEYCHAR.js';


const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

stdin.setRawMode(true).resume();
stdin.setEncoding('utf8');
readline.emitKeypressEvents(stdin, rl);

rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});

stdin.on('data', (key) => {
  const string = key.toString();
  if (string.length == 3) {
    const id = string.charCodeAt(2);
    if (id  === KEYCODE_ENUM.UP) {
      console.log(KEYCHAR_ENUM.UP);
    } else if (id === KEYCODE_ENUM.DOWN) {
      console.log(KEYCHAR_ENUM.DOWN);
    } else if (id === KEYCODE_ENUM.RIGHT) {
      console.log(KEYCHAR_ENUM.RIGHT);
    } else if (id === KEYCODE_ENUM.LEFT) {
      console.log(KEYCHAR_ENUM.LEFT);
    }
    
  }
});

