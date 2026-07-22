import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage(){
  if(!await getCurrentUser()) redirect("/admin");
  const [services,blocks]=await Promise.all([
    prisma.service.findMany({orderBy:{sortOrder:"asc"}}),
    prisma.blockedTime.findMany({where:{endTime:{gte:new Date()}},orderBy:{startTime:"asc"},take:20})
  ]);
  return <section className="adminShell"><AdminNav/><div className="adminMain"><p className="eyebrow">SHOP SCHEDULE</p><h1>Book a car or block time</h1><p className="muted">Use this when a customer calls, walks in, or when you need to make a time unavailable online.</p><ScheduleClient services={services.map(s=>({id:s.id,name:s.name,durationMinutes:s.durationMinutes}))} blocks={blocks.map(b=>({id:b.id,startTime:b.startTime.toISOString(),endTime:b.endTime.toISOString(),reason:b.reason}))}/></div></section>
}
