"use client";
import { useState } from "react";

type Service={id:string;name:string;durationMinutes:number};
type Block={id:string;startTime:string;endTime:string;reason:string|null};

export default function ScheduleClient({services,blocks}:{services:Service[];blocks:Block[]}){
  const [tab,setTab]=useState<"booking"|"block">("booking");
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const [form,setForm]=useState({serviceId:services[0]?.id||"",date:"",time:"",name:"",phone:"",email:"",year:"",make:"",model:"",mileage:"",plate:"",vin:"",description:"",internalNotes:""});
  const [block,setBlock]=useState({start:"",end:"",reason:""});
  const update=(key:string,value:string)=>setForm(f=>({...f,[key]:value}));

  async function createBooking(){
    setBusy(true);setError("");setMessage("");
    const res=await fetch("/api/admin/manual-booking",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const data=await res.json();setBusy(false);
    if(!res.ok){setError(data.error||"Could not create appointment.");return;}
    setMessage("Appointment created and confirmed.");
    setForm(f=>({...f,date:"",time:"",name:"",phone:"",email:"",year:"",make:"",model:"",mileage:"",plate:"",vin:"",description:"",internalNotes:""}));
  }

  async function createBlock(){
    setBusy(true);setError("");setMessage("");
    const res=await fetch("/api/admin/blocked-time",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(block)});
    const data=await res.json();setBusy(false);
    if(!res.ok){setError(data.error||"Could not block time.");return;}
    setMessage("Time blocked. Customers will not be able to book over it.");
    setBlock({start:"",end:"",reason:""});
    setTimeout(()=>location.reload(),700);
  }

  async function removeBlock(id:string){await fetch(`/api/admin/blocked-time?id=${id}`,{method:"DELETE"});location.reload();}

  return <div className="scheduleManager">
    <div className="scheduleTabs"><button className={tab==="booking"?"active":""} onClick={()=>{setTab("booking");setMessage("");setError("")}}>Manual booking</button><button className={tab==="block"?"active":""} onClick={()=>{setTab("block");setMessage("");setError("")}}>Block off time</button></div>
    {message&&<p className="successBanner">{message}</p>}{error&&<p className="error">{error}</p>}
    {tab==="booking"?<div className="adminFormCard"><h2>Book a customer in</h2><div className="formGrid"><label>Service<select value={form.serviceId} onChange={e=>update("serviceId",e.target.value)}>{services.map(s=><option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>)}</select></label><label>Date<input type="date" value={form.date} onChange={e=>update("date",e.target.value)}/></label><label>Time<input type="time" step="1800" value={form.time} onChange={e=>update("time",e.target.value)}/></label><label>Customer name<input value={form.name} onChange={e=>update("name",e.target.value)}/></label><label>Phone<input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)}/></label><label>Email<input type="email" value={form.email} onChange={e=>update("email",e.target.value)}/></label><label>Year<input inputMode="numeric" value={form.year} onChange={e=>update("year",e.target.value)}/></label><label>Make<input value={form.make} onChange={e=>update("make",e.target.value)}/></label><label>Model<input value={form.model} onChange={e=>update("model",e.target.value)}/></label><label>Mileage (km)<input inputMode="numeric" value={form.mileage} onChange={e=>update("mileage",e.target.value)}/></label><label>Plate<input value={form.plate} onChange={e=>update("plate",e.target.value.toUpperCase())}/></label><label>VIN<input value={form.vin} onChange={e=>update("vin",e.target.value.toUpperCase())}/></label></div><label>Customer concern / requested work<textarea rows={3} value={form.description} onChange={e=>update("description",e.target.value)}/></label><label>Internal shop note<textarea rows={3} value={form.internalNotes} onChange={e=>update("internalNotes",e.target.value)} placeholder="Phone booking, drop-off instructions, parts note, etc."/></label><button className="button" disabled={busy} onClick={createBooking}>{busy?"Saving…":"Create confirmed appointment"}</button></div>
    :<div className="adminFormCard"><h2>Block online booking time</h2><p className="muted">Block one slot, several hours, or a full day.</p><div className="formGrid"><label>Start<input type="datetime-local" value={block.start} onChange={e=>setBlock(b=>({...b,start:e.target.value}))}/></label><label>End<input type="datetime-local" value={block.end} onChange={e=>setBlock(b=>({...b,end:e.target.value}))}/></label></div><label>Reason<input value={block.reason} onChange={e=>setBlock(b=>({...b,reason:e.target.value}))} placeholder="Lunch, closed, personal appointment, fully booked…"/></label><button className="button" disabled={busy} onClick={createBlock}>{busy?"Saving…":"Block this time"}</button><h3 className="topGap">Upcoming blocked time</h3><div className="blockList">{blocks.length?blocks.map(b=><div key={b.id}><span>{new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}</span><span>{b.reason||"Blocked"}</span><button onClick={()=>removeBlock(b.id)}>Remove</button></div>):<p className="muted">No upcoming blocks.</p>}</div></div>}
  </div>
}
