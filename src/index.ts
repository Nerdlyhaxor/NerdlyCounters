import fs = require("fs");

class Counter {
    counter: number;
    messageTemplate: string;
    token: string;

    constructor(deathCount: number, token: string, messageTemplate: string) {
        this.counter = deathCount;
        this.messageTemplate = messageTemplate;
        this.token = token;
    }

    getMessage(): string {
        return this.messageTemplate.replace(this.token, this.counter.toString());
    }

    Increment(): void {
       this.counter++;
    }

    Decrament(): void {
        this.counter--;
    }

    Reset(): void {
        this.counter = 0;
    }
}

class CounterSettings {
    dataFileName: string;
    labelFileName: string;

    constructor(dataFileName: string, labelFileName: string) {
        this.dataFileName= dataFileName;
        this.labelFileName = labelFileName;
    }
}

class CounterFactory {
    counter: Counter;
    settings: CounterSettings;

    constructor(settingsFileName: string) {
        this.counter = new Counter(0, "", "");
        this.settings = this.readSettings(settingsFileName);
    }

    readSettings(settingsFileName: string): CounterSettings {
        if(!fs.existsSync(settingsFileName)) {
            console.log("Settings file not found!");
        }

        let contents: string = fs.readFileSync(settingsFileName, "utf8");
        let input: any = JSON.parse(contents);

        return new CounterSettings(input.dataFileName, input.labelFileName);

    }

    readData(): void {
        let contents: string = fs.readFileSync(this.settings.dataFileName, "utf8");
        let input: any = JSON.parse(contents);

        this.counter = new Counter(input.counter, input.token, input.messageTemplate);
    }

    saveData(): void {
        fs.writeFileSync(this.settings.dataFileName, this.toJSON());
    }

    saveLabel(): void {
        if(this.counter === undefined) {
            throw "Counter is undefined!";
        }

        fs.writeFileSync(this.settings.labelFileName, this.counter.getMessage());
    }

    toJSON(): string {
        return JSON.stringify(this.counter);
    }

    IncrementCounter(): void {
        factory.readData();
        this.counter.Increment();
        factory.saveLabel();
        factory.saveData();
    }

    DecrementCounter(): void {
        factory.readData();
        this.counter.Decrament();
        factory.saveLabel();
        factory.saveData();
    }

    ResetCounter(): void {
        factory.readData();
        this.counter.Reset();
        factory.saveLabel();
        factory.saveData();
    }

    RefreshCounter(): void {
        factory.readData();
        factory.saveLabel();
    }
}

let factory: CounterFactory = new CounterFactory("counter-settings.json");

let command: string = process.argv[2];

switch(command) {
    case "inc":
        factory.IncrementCounter();
        break;
    case "dec":
        factory.DecrementCounter();
        break;
    case "reset":
        factory.ResetCounter();
        break;
    case "refresh":
        factory.RefreshCounter();
        break;
}

