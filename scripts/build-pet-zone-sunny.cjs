// Builds the Pet Zone icons for the sunny glass theme.
// Same artwork as build-pet-zone.cjs, but every icon uses the warm orange palette (0)
// and has no tile background, so it sits directly on the frosted card.
// Output: public/pet-zone/sunny/petzone-<name>.{svg,webp}
// Run: node scripts/build-pet-zone-sunny.cjs
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {illustration} = require('./pet-illustration.cjs');

const entities = [
  ['hospitals','hospital'],['food','bowl'],['accessories','collar'],['grooming','brush'],
  ['adoption','heart'],['training','paw'],['acquire','house'],['more','more'],
];

// Crop the 160x160 canvas to the artwork (drawn in roughly x 36-124, y 44-130).
const VIEWBOX = '28 36 104 100';

async function main() {
  const dir = path.join(__dirname,'../public/pet-zone/sunny');
  await fs.mkdir(dir,{recursive:true});
  for (const [name,mark] of entities) {
    const svg = illustration(mark,0)
      .replace(/<rect width="160" height="160"[^>]*\/>/,'')
      .replace('viewBox="0 0 160 160"','viewBox="'+VIEWBOX+'"')
      .replace('width="160" height="160"','width="208" height="200"');
    const stem = path.join(dir,'petzone-'+name);
    await fs.writeFile(stem+'.svg',svg+'\n');
    await sharp(Buffer.from(svg)).webp({quality:90,alphaQuality:95}).toFile(stem+'.webp');
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
