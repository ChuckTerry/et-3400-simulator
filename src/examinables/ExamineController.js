import { examinableNameArray, examinableCount } from './examinableNameArray.js';

export class ExamineController {
    constructor() {
        this.examinables = new Map();
        const path = './examinables/html/';
        for (let index = 0; index < examinableCount; index++) {
            const name = examinableNameArray[index];
            const filePath = `${path}${name}.html`;
            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    this.examinables.set(name, data);
                });
        }
    }

    display(element) {
        if (element.classList.contains('examinable') === false) {
            return;
        }
        const name = element.dataset.name;
        let content = this.examinables.has(name)
            ? this.examinables.get(name)
            : this.examinables.get('not-found');
        document.querySelector('#examine-template').innerHTML = content;
        document.querySelector('#examine-dialog').showModal();
    }
}
