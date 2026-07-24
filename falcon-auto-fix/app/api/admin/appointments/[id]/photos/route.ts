import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!await getCurrentUser())return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:"Photo storage is not configured yet."},{status:503});
  const {id}=await params;
  const form=await req.formData(); const file=form.get("file"); const caption=String(form.get("caption")||"");
  if(!(file instanceof File))return NextResponse.json({error:"Choose an image."},{status:400});
  if(!file.type.startsWith("image/"))return NextResponse.json({error:"Only image files are supported."},{status:400});
  const blob=await put(`appointments/${id}/${Date.now()}-${file.name}`,file,{access:"public"});
  const photo=await prisma.jobPhoto.create({data:{appointmentId:id,url:blob.url,caption:caption||null}});
  return NextResponse.json(photo,{status:201});
}
