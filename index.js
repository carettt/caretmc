"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function closeFd(fd) {
    (0, fs_1.close)(fd, (err) => {
        if (err)
            throw err;
    });
}
function append(filepath, data) {
    (0, fs_1.open)(filepath, 'a', (err, fd) => {
        if (err)
            throw err;
        (0, fs_1.appendFile)(fd, data, 'utf-8', (err) => {
            if (err)
                throw err;
            closeFd(fd);
        });
    });
}
class Context {
    constructor() {
        this.compileString = '';
    }
    execute(callback) {
        let context = new Context();
        callback(context);
        this.compileString += `execute ${context.compileString}\\n`;
    }
    as(entity, callback) {
        let entityContext = new EntityContext(entity);
        callback(entityContext);
        this.compileString += `as ${entity} ${entityContext.compileString}`;
        this.compileString += `summon minecraft:zombie`;
    }
    at(entity, callback) {
        let entityContext = new EntityContext(entity);
        callback(entityContext);
        this.compileString += `at ${entity} ${entityContext.compileString}`;
    }
}
class EntityContext extends Context {
    constructor(entity) {
        super();
        this.entity = entity;
    }
}
class Datapack {
    constructor(name, options = { pack_format: 10 }) {
        (0, fs_1.mkdir)(name, (err) => {
            if (err)
                throw err;
            append(name + '/pack.mcmeta', JSON.stringify(options));
        });
        (0, fs_1.mkdir)(name + '/data', (err) => {
            if (err)
                throw err;
        });
    }
    compile(callback) {
        let fileString = '';
        let mcContext = new Context();
        callback(mcContext);
        fileString = mcContext.compileString;
        console.log(fileString);
    }
}
const datapack = new Datapack('caretmc1');
datapack.compile((ctx) => {
    ctx.execute((ctx) => {
        ctx.as('caret_', (ctx) => { });
    });
});
