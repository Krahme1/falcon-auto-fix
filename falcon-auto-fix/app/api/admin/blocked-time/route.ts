import { NextRequest,NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { torontoDateTimeLocal } from "@/lib/time";

export async function POST(req:NextRequest){
  if(!await getCurrentUser())return NextResponse.json({error:"Unauthorized"},{status:401});
  const b=await req.json();
  const start=String(b.start||"").includes("T")?torontoDateTimeLocal(b.start):new Date(b.start);
  const end=String(b.end||"").includes("T")?torontoDateTimeLocal(b.end):new Date(b.end);
  if(!start.getTime()||!end.getTime()||end<=start)return NextResponse.json({error:"Invalid dates"},{status:400});
  const conflict=await prisma.appointment.findFirst({where:{startTime:{lt:end},endTime:{gt:start},status:{not:"CANCELLED"}}});
  if(conflict)return NextResponse.json({error:"An appointment already occupies part of that time."},{status:409});
  const row=await prisma.blockedTime.create({data:{startTime:start,endTime:end,reason:b.reason||null}});
  return NextResponse.json({id:row.id})
}
export async function DELETE(req:NextRequest){if(!await getCurrentUser())return NextResponse.json({error:"Unauthorized"},{status:401});const id=req.nextUrl.searchParams.get("id");if(!id)return NextResponse.json({error:"Missing id"},{status:400});await prisma.blockedTime.delete({where:{id}});return NextResponse.json({ok:true})}
