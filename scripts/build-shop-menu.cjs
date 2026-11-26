const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const {illustration} = require('./pet-illustration.cjs');

const groups = {
  pets: ['dog','cat','rabbit','heart'],
  food: ['bag','bowl','bone'],
  accessories: ['collar','bowl','house'],
  grooming: ['bottle','brush','bottle'],
  vet: ['hospital','calendar','heart'],
  toys: ['ball','feather','house'],
  health: ['leaf','heart','brush'],
  offers: ['tag','gift','collar'],
};

async function main() {
  const dir = path.join(__dirname,'../public/shop-menu');
  await fs.mkdir(dir,{recursive:true});
  for (const [category,marks] of Object.entries(groups)) {
    for (const [index,mark] of marks.entries()) {
      const drawing = illustration(mark, Object.keys(groups).indexOf(category)+index, true);
      await sharp(Buffer.from(drawing)).webp({quality:84}).toFile(path.join(dir,category+'-'+index+'.webp'));
    }
  }
}
main().catch(error => {console.error(error);process.exitCode=1;});
