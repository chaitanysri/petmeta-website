// Makes lighter copies of the species cutouts for cards (420px) and the hero (760px).
// Output: public/pet-hero/thumb/<name>.webp and public/pet-hero/md/<name>.webp
// Run: node scripts/build-pet-thumbs.cjs
const fs=require('node:fs/promises'),path=require('node:path'),sharp=require('sharp');
const names=['dog','cat','rabbit','bird','fish','tortoise'];
(async()=>{
  const src=path.join(__dirname,'../public/pet-hero');
  for(const [dir,width] of [['thumb',420],['md',760]]){
    await fs.mkdir(path.join(src,dir),{recursive:true});
    for(const n of names) await sharp(path.join(src,n+'.webp')).resize({width}).webp({quality:84,alphaQuality:92}).toFile(path.join(src,dir,n+'.webp'));
  }
})().catch(e=>{console.error(e);process.exitCode=1});
