'use strict';
const P=require('./policy.cjs');
module.exports=({db,ref,now,getStorage})=>async function customerReviews(user,action,businessId,payload){
 P.assert(/^[a-zA-Z0-9_-]{1,128}$/.test(businessId),'Choose a seller.');
 if(action==='customer.reviews'){
  const productId=P.text(payload.productId||'',120);P.assert(productId,'Choose a product.');
  const rows=await db.collection(`publicBusinesses/${businessId}/publicReviews`).where('productId','==',productId).limit(100).get();
  return {reviews:rows.docs.filter(d=>d.data().status==='Approved').map(d=>({id:d.id,...d.data()}))};
 }
 if(action==='customer.review.submit'){
  const orderId=P.text(payload.orderId||'',120),productId=P.text(payload.productId||'',120),rating=Number(payload.rating),text=P.text(payload.text||'',2000),images=payload.images||[];
  P.assert(Number.isInteger(rating)&&rating>=1&&rating<=5,'Choose a rating from 1 to 5.');P.assert(text.length>=10,'Write at least 10 characters about your purchase.');
  P.assert(Array.isArray(images)&&images.length<=3,'Add up to three photos.');
  const order=await ref(businessId,'orders',orderId).get();P.assert(order.exists&&order.data().customerUid===user.uid,'Order access denied.',403);
  P.assert(order.data().status==='Completed'&&!order.data().testMode,'Reviews open after a real order is completed.',409);
  P.assert(order.data().items?.some(item=>item.productId===productId),'This product is not in your order.',403);
  const uploaded=[];for(const image of images){const path=P.text(image.path||'',500);P.assert(path.startsWith(`reviews/${businessId}/${orderId}/${productId}/${user.uid}/`),'Invalid review photo.',403);const [meta]=await getStorage().bucket('petmeta-e8470.firebasestorage.app').file(path).getMetadata();P.assert(Number(meta.size)<=4*1024*1024&&['image/jpeg','image/png','image/webp'].includes(meta.contentType),'Choose a JPG, PNG or WebP under 4 MB.');const token=meta.metadata?.firebaseStorageDownloadTokens;P.assert(token,'Review photo is unavailable.');uploaded.push(`https://firebasestorage.googleapis.com/v0/b/petmeta-e8470.firebasestorage.app/o/${encodeURIComponent(path)}?alt=media&token=${String(token).split(',')[0]}`);}
  const id=P.hash(`${user.uid}:${orderId}:${productId}`),target=db.doc(`publicBusinesses/${businessId}/publicReviews/${id}`);
  await db.runTransaction(async t=>{const prior=await t.get(target);P.assert(!prior.exists,'You already reviewed this order item.',409);t.create(target,{businessId,orderId,productId,customerUid:user.uid,displayName:user.name||user.email?.split('@')[0]||'PetMeta customer',rating,text,images:uploaded,status:'Pending',createdAt:now()});});
  return {id,status:'Pending'};
 }
 P.assert(user.petmetaAdmin===true,'Reviewer permission is required.',403);P.assert(action==='review.customer.decide','Unknown review action.');
 const target=db.doc(`publicBusinesses/${businessId}/publicReviews/${P.text(payload.id||'',120)}`),status=P.text(payload.status||'',40);P.assert(['Approved','Rejected'].includes(status),'Choose a review decision.');const prior=await target.get();P.assert(prior.exists,'Review not found.',404);await target.update({status,reviewedAt:now(),reviewerUid:user.uid});return {saved:true};
};
