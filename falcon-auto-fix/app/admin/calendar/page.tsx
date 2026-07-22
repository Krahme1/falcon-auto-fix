import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { BUSINESS_TZ } from "@/lib/time";
export default async function CalendarPage(){
 if(!await getCurrentUser()) redirect("/admin");
 const start=new Date(); start.setHours(0,0,0,0); const end=new Date(start.getTime()+35*86400000);
 const appts=await prisma.appointment.findMany({where:{startTime:{gte:start,lt:end},status:{not:"CANCELLED"}},orderBy:{startTime:"asc"},include:{customer:true,vehicle:true,service:true}});
 const groups=new Map<string,typeof appts>();
 for(const a of appts){const key=new Intl.DateTimeFormat("en-CA",{timeZone:BUSINESS_TZ,weekday:"long",month:"long",day:"numeric"}).format(a.startTime); groups.set(key,[...(groups.get(key)||[]),a]);}
 return <section className="adminShell"><AdminNav/><div className="adminMain"><p className="eyebrow">CALENDAR</p><h1>Next 5 weeks</h1><div className="calendarDays">{[...groups].map(([day,items])=><section className="calendarDay" key={day}><h3>{day}</h3>{items.map(a=><div className="calendarEvent" key={a.id}><b>{new Intl.DateTimeFormat("en-CA",{timeZone:BUSINESS_TZ,hour:"numeric",minute:"2-digit"}).format(a.startTime)}</b><span>{a.customer.name}</span><span>{a.vehicle.year} {a.vehicle.make} {a.vehicle.model}</span><span>{a.service?.name}</span></div>)}</section>)}{!appts.length&&<p>No upcoming appointments.</p>}</div></div></section>
}
