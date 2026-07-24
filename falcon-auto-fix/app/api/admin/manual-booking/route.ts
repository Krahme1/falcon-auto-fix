import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { torontoDateTime, formatLocal } from "@/lib/time";
import { sendMail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

export async function POST(req:NextRequest){
  if(!await getCurrentUser()) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const b=await req.json();
    const required=["serviceId","date","time","year","make","model","name","phone"];
    if(required.some(k=>!String(b[k]||"").trim())) return NextResponse.json({error:"Complete the required customer, vehicle, service, date and time fields."},{status:400});
    const service=await prisma.service.findUnique({where:{id:b.serviceId}});
    if(!service) return NextResponse.json({error:"Service not found."},{status:404});
    const start=torontoDateTime(b.date,b.time);
    const end=new Date(start.getTime()+service.durationMinutes*60000);
    const [blocked,conflict]=await Promise.all([
      prisma.blockedTime.findFirst({where:{startTime:{lt:end},endTime:{gt:start}}}),
      prisma.appointment.findFirst({where:{startTime:{lt:end},endTime:{gt:start},status:{not:"CANCELLED"}}})
    ]);
    if(blocked) return NextResponse.json({error:"That time is currently blocked off."},{status:409});
    if(conflict) return NextResponse.json({error:"Another appointment already occupies that time."},{status:409});
    const result=await prisma.$transaction(async tx=>{
      let customer=await tx.customer.findFirst({where:{OR:[...(b.email?[{email:b.email}]:[]),{phone:b.phone}]}});
      if(!customer) customer=await tx.customer.create({data:{name:b.name,email:b.email||null,phone:b.phone}});
      else customer=await tx.customer.update({where:{id:customer.id},data:{name:b.name,email:b.email||customer.email,phone:b.phone}});
      let vehicle=await tx.vehicle.findFirst({where:{customerId:customer.id,year:Number(b.year),make:{equals:b.make,mode:"insensitive"},model:{equals:b.model,mode:"insensitive"}}});
      if(!vehicle) vehicle=await tx.vehicle.create({data:{customerId:customer.id,year:Number(b.year),make:b.make,model:b.model,mileage:b.mileage?Number(b.mileage):null,plate:b.plate||null,vin:b.vin||null}});
      else vehicle=await tx.vehicle.update({where:{id:vehicle.id},data:{mileage:b.mileage?Number(b.mileage):vehicle.mileage,plate:b.plate||vehicle.plate,vin:b.vin||vehicle.vin}});
      const appointment=await tx.appointment.create({data:{customerId:customer.id,vehicleId:vehicle.id,serviceId:service.id,startTime:start,endTime:end,status:"CONFIRMED",description:b.description||null,internalNotes:b.internalNotes||"Booked manually by admin (phone/in-person)."}});
      return {appointment,customer,vehicle};
    });
    const when=formatLocal(start); const text=`Falcon Auto Fix: Your ${service.name} appointment is confirmed for ${when}. Call (548) 689-9097 if you need to make a change.`;
    if(result.customer.email) await sendMail({to:result.customer.email,subject:"Falcon Auto Fix — appointment confirmed",html:`<h2>Your appointment is confirmed.</h2><p>${service.name} • ${when}</p><p>${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model}</p><p>Falcon Auto Fix • (548) 689-9097</p>`});
    await sendSms({to:result.customer.phone,body:text});
    return NextResponse.json({id:result.appointment.id},{status:201});
  }catch(e){console.error(e);return NextResponse.json({error:"Unable to create the manual appointment."},{status:500})}
}
