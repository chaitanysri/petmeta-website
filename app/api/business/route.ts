import {NextRequest,NextResponse} from 'next/server';
export const runtime='nodejs';
const backend=process.env.BUSINESS_API_URL||process.env.NEXT_PUBLIC_BUSINESS_API_URL||'https://petmeta-business-services.neeleshdodda56.chatgpt.site/businessApi';
export async function POST(req:NextRequest){
 const bearer=req.headers.get('authorization');if(!bearer?.startsWith('Bearer '))return NextResponse.json({error:'Sign in to continue.'},{status:401});
 let body:{action?:string;businessId?:string;payload?:unknown};try{body=await req.json()}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 if(typeof body.action!=='string'||body.action.length>100||typeof body.businessId!=='string'||body.businessId.length>128)return NextResponse.json({error:'Invalid request.'},{status:400});
 const url=['payment.link','payment.refund','customer.pay','finance.reconcile'].includes(body.action)?backend.replace(/businessApi$/,'businessPayments'):backend;
 try{const response=await fetch(url,{method:'POST',headers:{Authorization:bearer,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(45000)});const data=await response.text();return new NextResponse(data,{status:response.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'The business service could not be reached. Please retry.'},{status:503})}
}
