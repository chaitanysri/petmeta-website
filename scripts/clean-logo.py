"""Create a clean, tightly-cropped PetMeta logo (no faint halo) from the original transparent PNG.
Usage: python3 scripts/clean-logo.py"""
from PIL import Image
import numpy as np
SRC='public/branding/petmeta-orange-transparent.png'; OUT='public/branding/petmeta-logo-clean.png'
im=Image.open(SRC).convert('RGBA'); a=np.array(im).astype(np.float32)
al=a[...,3]
al[al<40]=0                      # drop the faint halo
a[...,3]=al
# defringe: where alpha is low, pull colour from nearby solid pixels' average is overkill; just clamp colour of near-transparent pixels
a[al==0,:3]=0
out=Image.fromarray(a.astype(np.uint8),'RGBA')
bb=out.getchannel('A').getbbox(); pad=int(0.02*max(bb[2]-bb[0],bb[3]-bb[1]))
box=(max(0,bb[0]-pad),max(0,bb[1]-pad),min(out.width,bb[2]+pad),min(out.height,bb[3]+pad))
out=out.crop(box); out.thumbnail((1000,1000),Image.LANCZOS); out.save(OUT,optimize=True)
print(OUT,out.size)
