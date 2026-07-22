import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/ContactIcons";

export default function Contact(){return <section className="section"><div className="container"><p className="eyebrow">CONTACT</p><h1>Come see us on Falcon Street.</h1><div className="contactPanel">
  <div><h3>Falcon Auto Fix</h3><a className="contactLink" href="https://www.google.com/maps/search/?api=1&query=Unit+7+120+Falcon+Street+London+Ontario+N5W+4Z1" target="_blank" rel="noreferrer"><MapPinIcon/><span>Unit 7 - 120 Falcon Street<br/>London, Ontario N5W 4Z1</span></a><p className="sloganSmall">QUALITY SERVICE. KEEPING YOU ON THE ROAD.</p></div>
  <div className="contactLinks"><h3>Get in touch</h3><a className="contactLink" href="tel:+15486899097"><PhoneIcon/><span>(548) 689-9097</span></a><a className="contactLink" href="mailto:falconauto47@gmail.com"><MailIcon/><span>falconauto47@gmail.com</span></a><a className="contactLink" target="_blank" rel="noreferrer" href="https://www.instagram.com/falcon.auto.fix/"><InstagramIcon/><span>@falcon.auto.fix</span></a></div>
  <div><h3>Hours</h3><p>Mon–Fri: 8 AM–8 PM<br/>Saturday: 9 AM–6 PM<br/>Sunday: Closed</p></div>
</div></div></section>}
