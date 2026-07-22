"use client";
import { useState } from "react";
export default function ServiceEditor({service}:{service:{id:string;name:string;description:string;durationMinutes:number;active:boolean}}){
 const [duration,setDuration]=useState(service.durationMinutes),[active,setActive]=useState(service.active),[busy,setBusy]=useState(false);
 async function save(){setBusy(true);await fetch(`/api/admin/services/${service.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({durationMinutes:duration,active})});setBusy(false);location.reload()}
 return <div className="serviceEdit"><b>{service.name}</b><small>{service.description}</small><label>Duration (min)<input type="number" min="15" step="15" value={duration} onChange={e=>setDuration(Number(e.target.value))}/></label><label className="inlineCheck"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Available online</label><button disabled={busy} onClick={save}>Save</button></div>
}
