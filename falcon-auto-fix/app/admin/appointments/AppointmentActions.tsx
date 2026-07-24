"use client";
import { useRef, useState } from "react";

type Photo={id:string;url:string;caption:string|null};
export default function AppointmentActions({id,status,internalNotes,estimateCents,invoiceCents,paymentStatus,paymentMethod,photos}:{id:string;status:string;internalNotes:string|null;estimateCents:number|null;invoiceCents:number|null;paymentStatus:string;paymentMethod:string|null;photos:Photo[]}){
 const [busy,setBusy]=useState(false),[notes,setNotes]=useState(internalNotes||""),[estimate,setEstimate]=useState(estimateCents?String(estimateCents/100):""),[invoice,setInvoice]=useState(invoiceCents?String(invoiceCents/100):""),[payment,setPayment]=useState(paymentStatus),[method,setMethod]=useState(paymentMethod||""),[caption,setCaption]=useState(""),[photoError,setPhotoError]=useState("");
 const fileRef=useRef<HTMLInputElement>(null);
 async function update(next:string){setBusy(true);await fetch(`/api/admin/appointments/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});location.reload()}
 async function saveDetails(){setBusy(true);await fetch(`/api/admin/appointments/${id}/details`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({internalNotes:notes,estimateDollars:estimate,invoiceDollars:invoice,paymentStatus:payment,paymentMethod:method})});setBusy(false);location.reload()}
 async function uploadPhoto(){const file=fileRef.current?.files?.[0];if(!file)return;setBusy(true);setPhotoError("");const form=new FormData();form.append("file",file);form.append("caption",caption);const res=await fetch(`/api/admin/appointments/${id}/photos`,{method:"POST",body:form});const data=await res.json();setBusy(false);if(!res.ok){setPhotoError(data.error||"Upload failed.");return;}location.reload()}
 return <div className="adminControls">
   <div className="rowActions">
    <button disabled={busy||status==="CONFIRMED"} onClick={()=>update("CONFIRMED")}>Confirm</button>
    <button disabled={busy||status==="CHECKED_IN"} onClick={()=>update("CHECKED_IN")}>Checked in</button>
    <button disabled={busy||status==="IN_PROGRESS"} onClick={()=>update("IN_PROGRESS")}>In service</button>
    <button disabled={busy||status==="WAITING_FOR_PARTS"} onClick={()=>update("WAITING_FOR_PARTS")}>Waiting for parts</button>
    <button disabled={busy||status==="READY_FOR_PICKUP"} onClick={()=>update("READY_FOR_PICKUP")}>Ready for pickup</button>
    <button disabled={busy||status==="COMPLETED"} onClick={()=>update("COMPLETED")}>Complete</button>
    <button disabled={busy||status==="CANCELLED"} className="danger" onClick={()=>update("CANCELLED")}>Cancel</button>
    <button type="button" onClick={()=>window.print()}>Print job</button>
   </div>
   <details><summary>Shop details</summary>
    <label>Internal notes<textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)}/></label>
    <label>Estimate ($)<input inputMode="decimal" value={estimate} onChange={e=>setEstimate(e.target.value)}/></label>
    <label>Invoice ($)<input inputMode="decimal" value={invoice} onChange={e=>setInvoice(e.target.value)}/></label>
    <label>Payment<select value={payment} onChange={e=>setPayment(e.target.value)}><option>UNPAID</option><option>DEPOSIT_PAID</option><option>PAID</option><option>REFUNDED</option></select></label>
    <label>Payment method<select value={method} onChange={e=>setMethod(e.target.value)}><option value="">Not recorded</option><option>Cash</option><option>Debit</option><option>Credit</option><option>e-Transfer</option><option>Other</option></select></label>
    <button onClick={saveDetails} disabled={busy}>Save details</button>
   </details>
   <details><summary>Vehicle photos ({photos.length})</summary>
    {photos.length>0&&<div className="photoGrid">{photos.map(p=><a key={p.id} href={p.url} target="_blank" rel="noreferrer"><img src={p.url} alt={p.caption||"Vehicle photo"}/>{p.caption&&<small>{p.caption}</small>}</a>)}</div>}
    <label>Photo<input ref={fileRef} type="file" accept="image/*"/></label><label>Caption<input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="e.g. Front bumper before repair"/></label>
    {photoError&&<p className="error">{photoError}</p>}<button onClick={uploadPhoto} disabled={busy}>Upload photo</button>
   </details>
 </div>
}
