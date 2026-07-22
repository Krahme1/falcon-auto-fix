import { NextRequest, NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { torontoDateTime } from "@/lib/time";
export async function GET(req:NextRequest){
 const date=req.nextUrl.searchParams.get("date"), serviceId=req.nextUrl.searchParams.get("serviceId"); if(!date||!serviceId)return NextResponse.json({slots:[]});
 const service=await prisma.service.findUnique({where:{id:serviceId}}); if(!service||!service.active)return NextResponse.json({slots:[]});
 const [y,m,d]=date.split("-").map(Number); const dow=new Date(Date.UTC(y,m-1,d)).getUTCDay(); const hours=await prisma.businessHour.findUnique({where:{dayOfWeek:dow}}); if(!hours?.isOpen)return NextResponse.json({slots:[]});
 const dayStart=torontoDateTime(date,"00:00"), dayEnd=torontoDateTime(date,"23:59");
 const [appointments,blocked]=await Promise.all([
  prisma.appointment.findMany({where:{startTime:{lte:dayEnd},endTime:{gte:dayStart},status:{not:"CANCELLED"}},select:{startTime:true,endTime:true}}),
  prisma.blockedTime.findMany({where:{startTime:{lte:dayEnd},endTime:{gte:dayStart}},select:{startTime:true,endTime:true}})
 ]);
 const toMin=(s:string)=>{const [h,mi]=s.split(":").map(Number);return h*60+mi}; const fmt=(v:number)=>`${String(Math.floor(v/60)).padStart(2,"0")}:${String(v%60).padStart(2,"0")}`;
 const slots:string[]=[]; for(let cur=toMin(hours.openTime); cur+service.durationMinutes<=toMin(hours.closeTime); cur+=30){ const time=fmt(cur), start=torontoDateTime(date,time), end=new Date(start.getTime()+service.durationMinutes*60000); const busy=[...appointments,...blocked].some(x=>start<x.endTime&&end>x.startTime); const tooSoon=start.getTime()<Date.now()+60*60*1000; if(!busy&&!tooSoon)slots.push(time); }
 return NextResponse.json({slots});
}
