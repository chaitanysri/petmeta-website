'use client';
/** Shows /category-photos/<name>.webp when a real photo exists, otherwise the vector illustration. */
export default function PointImage({name,alt='',className,width,height,eager}:{name:string;alt?:string;className?:string;width:number;height:number;eager?:boolean}){
  return <img className={className} src={`/category-photos/${name}.webp`} alt={alt} width={width} height={height} loading={eager?'eager':'lazy'} decoding="async"
    onError={e=>{const t=e.currentTarget;t.onerror=null;t.src=`/category-images/${name}.svg`}}/>;
}
