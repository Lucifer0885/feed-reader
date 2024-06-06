import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { access, constants, readFile, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonFile = join(__dirname, 'feeds.json');

//F_OK if file exists
//R_OK if can read file
//W_OK if can write to file
//X_OK if can execute file

export async function getLinks(){
    try {
        await access(jsonFile, constants.F_OK);
    } catch (error) {
        await writeFile(jsonFile, JSON.stringify([]));
    }
    
    const contents = await readFile(jsonFile, { encoding: 'utf-8'});

    return JSON.parse(contents);
};

export async function saveLinks(links){
    await writeFile(jsonFile, JSON.stringify(links));
};