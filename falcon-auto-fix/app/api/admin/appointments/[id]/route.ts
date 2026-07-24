import { NextRequest,NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { formatLocal } from "@/lib/time";

const allowed=["PENDING","CONFIRMED","CHECKED_IN","IN_PROGRESS","WAITING_FOR_PARTS","READY_FOR_PICKUP","COMPLETED","CANCELLED"] as const;

const labels: Record<string,string> = {
  CONFIRMED:"confirmed",
  CHECKED_IN:"checked in",
  IN_PROGRESS:"in service",
  WAITING_FOR_PARTS:"waiting for parts",
  READY_FOR_PICKUP:"ready for pickup",
  COMPLETED:"completed",
  CANCELLED:"cancelled"
};

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!await getCurrentUser())return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await params;const body=await req.json();
  if(!allowed.includes(body.status))return NextResponse.json({error:"Invalid status"},{status:400});
  const a=await prisma.appointment.update({where:{id},data:{status:body.status},include:{customer:true,service:true,vehicle:true}});
  const label=labels[body.status];
  if(label && body.status!=="IN_PROGRESS" && body.status!=="CHECKED_IN"){
    const when=formatLocal(a.startTime);
    const ready = body.status === "READY_FOR_PICKUP";
    const message = ready
      ? `Falcon Auto Fix: Your ${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model} is ready for pickup. Call (548) 689-9097 if you have any questions.`
      : `Falcon Auto Fix: Your appointment for ${a.service?.name || "service"} on ${when} is ${label}.`;
    if(a.customer.email)await sendMail({to:a.customer.email,subject:`Falcon Auto Fix — ${ready?"vehicle ready for pickup":`appointment ${label}`}`,html:`<h2>${ready?"Your vehicle is ready for pickup.":`Your appointment is ${label}.`}</h2><p>${a.service?.name||"Service"} • ${when}</p><p>${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}</p><p>Falcon Auto Fix • (548) 689-9097</p>`});
    await sendSms({to:a.customer.phone,body:message});
  }
  return NextResponse.json({ok:true});
}
