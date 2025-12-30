export class RuntimeObserver {
    static instance = null;

    constructor(combineNonUniqueEntries = true) {
        if (RuntimeObserver.instance) {
            return RuntimeObserver.instance;
        }
        this.informers = new Map();
        this.log = [];
        this.lastEntry = '';
        this.combineNonUniqueEntries = combineNonUniqueEntries;
        RuntimeObserver.instance = this;
    }

    addInformer(constructor, observedProperties) {
        this.informers.set(constructor, observedProperties);
    }

    dumpLog(logToConsole = true) {
        const logEntryCount = this.log.length;
        let returnString = '';
        for(let index = 0; index < logEntryCount; index++) {
            const [title, properties] = this.log[index];
            let string = `${title}:\n`;
            const propertyCount = properties.length;
            for(let propertyIndex = 0; propertyIndex < propertyCount; propertyIndex++) {
                const [property, value] = properties[propertyIndex];
                string += `  ${property}: ${value}\n`;
            }
            returnString += `${string}\n`;
            if (logToConsole) {
                console.log(string);
            }
        }
        return returnString;
    }

    removeInformer(constructor) {
        this.informers.delete(constructor);
    }

    /**
   * Report an event to add to the log
   * @param {string} eventName The name of the event to report
   * @param {any} object The object making the report
   * @returns {number} The index of the log entry in the log array
   */
    report(eventName, object) {
        const id = this.log.length;
        // If the object is an instance of a class that has been registered as an informer
        if (this.informers.has(object.constructor)) {
            // Get the properties of the object that are being observed
            const observedProperties = this.informers.get(object.constructor);
            const propertyCount = observedProperties.length;
            const propertyValues = [];
            // Push the values of the observed properties into the propertyValues array
            for(let index = 0; index < propertyCount; index++) {
                const property = observedProperties[index];
                propertyValues.push([property, object[property]]);
            }
            const title = `${object.constructor.name}::${eventName}`;
            const logEntry = [title, propertyValues];
            // Combine title and property values into a string for easy comparison
            const lastEntryString = logEntry.join(':');
            const lastMatch = this.lastEntry === lastEntryString;
            console.log(`${this.lastEntry}  <>  ${title}`);
            console.log(`Combine Unique? ${this.combineNonUniqueEntries}`);
            console.log(`Last Entry Starts With Title? ${this.lastEntry.startsWith(`${title}:`)}`);
            if (lastMatch || (this.combineNonUniqueEntries === true && this.lastEntry.startsWith(`${title}:`) === true)) {
                let titleString = this.log[id - 1][0];
                if (titleString.endsWith('occurrences)')) {
                    const occurrencesIndex = titleString.lastIndexOf('(');
                    const occurrences = parseInt(titleString.slice(occurrencesIndex + 1, -12), 10);
                    titleString = titleString.replace(/\(\d+ occurrences\)/, `(${occurrences + 1} occurrences)`);
                } else {
                    titleString += ' (2 occurrences)';
                }
                this.log[id - 1][0] = titleString;

            } else {
                this.lastEntry = lastEntryString;
                this.log.push(logEntry);
            }
            // If the object is not a registered informer
        } else {
            if (typeof object === 'object') {
                const title = `${object.constructor.name}::${eventName}`;
                this.log.push([title, []]);
            } else {
                const title = `${typeof object}::${eventName}`;
                this.log.push([title, []]);
            }
        }
        return id;
    }
}
