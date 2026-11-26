const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {illustration} = require('./pet-illustration.cjs');

const entities = [
  ['hospitals','hospital',2],['food','bowl',0],['accessories','collar',4],['grooming','brush',1],
  ['adoption','heart',1],['training','paw',3],['acquire','house',2],['more','more',3],
];

async function main() {
  const dir = path.join(__dirname,'../public/pet-zone');
  await fs.mkdir(dir,{recursive:true});
  for (const [name,mark,palette] of entities) {
    const svg = illustration(mark,palette);
    const stem = path.join(dir,'petzone-'+name);
    await fs.writeFile(stem+'.svg',svg+'\n');
    await sharp(Buffer.from(svg)).webp({quality:84}).toFile(stem+'.webp');
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
