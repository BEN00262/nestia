import fs from  "fs";
import path from "path";

export namespace SourceFinder
{
    async function gather(output: string[], directory: string): Promise<void>
    {
        const children: string[] = await fs.promises.readdir(directory);
        for (const file of children)
        {
            const current: string = `${directory}/${file}`;
            const stats: fs.Stats = await fs.promises.lstat(current);

            if (stats.isDirectory() === true)
            {
                await gather(output, current);
                continue;
            }
            else if (file.substr(-3) !== ".ts" || file.substr(-5) === ".d.ts")
                continue;

            output.push(current);
        }
    }

    export async function find(directory: string): Promise<string[]>
    {
        const output: string[] = [];
        await gather(output, directory);

        return output.map(str => path.normalize(str));
    }
}