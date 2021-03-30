const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
    constructor(input) {
        console.log('$$$$$$6');
        console.log(input);
    }
}

setWorldConstructor(CustomWorld);
