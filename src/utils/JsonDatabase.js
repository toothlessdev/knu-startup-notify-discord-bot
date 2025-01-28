import fs from "fs/promises";
import path from "path";

export class JsonDatabase {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async read() {
        const data = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    async update(key, value) {
        const data = await this.read();
        data[key] = value;
        await fs.writeFile(this.filePath, JSON.stringify(data));
    }

    async delete(key) {
        const data = await this.read();
        delete data[key];
        await fs.writeFile(this.filePath, JSON.stringify(data));
    }
}
