import { open, close, mkdir, appendFile, PathLike } from 'fs';

// Types -> caretmc.d.ts
interface mcmetaOptions {
    pack_format: 4 | 5 | 6 | 7 | 8 | 9 | 10;
    description?: string;
}

type Entity = string;

function closeFd(fd: number): void {
    close(fd, (err) => {
        if (err) throw err;
    });
}

function append(filepath: PathLike, data: string): void {
    open(filepath, 'a', (err, fd) => {
        if (err) throw err;

        appendFile(fd, data, 'utf-8', (err) => {
            if (err) throw err;
            closeFd(fd);
        });
    });
}

class Context {
    compileString: string;

    constructor() {
        this.compileString = '';
    }

    execute(callback: (ctx: Context) => void): void {
        let context = new Context();
        callback(context);
        this.compileString += `execute ${context.compileString}\\n`;
    }

    as(entity: Entity, callback: (ctx: EntityContext) => void): void {
        let entityContext = new EntityContext(entity);
        callback(entityContext);
        this.compileString += `as ${entity} ${entityContext.compileString}`;
        this.compileString += `summon minecraft:zombie`;
    }

    at(entity: Entity, callback: (ctx: EntityContext) => void): void {
        let entityContext = new EntityContext(entity);
        callback(entityContext);
        this.compileString += `at ${entity} ${entityContext.compileString}`;
    }
}

class EntityContext extends Context {
    entity: Entity;

    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }
}

class Datapack {
    constructor(name: string, options: mcmetaOptions = { pack_format: 10 }) {
        mkdir(name, (err) => {
            if (err) throw err;

            append(name + '/pack.mcmeta', JSON.stringify(options));
        });

        mkdir(name + '/data', (err) => {
            if (err) throw err;
        });
    }

    compile(callback: (ctx: Context) => void): void {
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
        ctx.as('caret_', (ctx) => {});
    });
});
