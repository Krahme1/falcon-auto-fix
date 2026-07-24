import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from "./ContactIcons";

export function Footer(){return <footer><div className="container footerGrid">
  <div className="footerBrand"><img src="/falcon-logo.jpg" alt="Falcon Auto Fix logo" className="footerLogo"/><div><strong>Falcon Auto Fix</strong><p>QUALITY SERVICE. KEEPING YOU ON THE ROAD.</p></div></div>
  <div className="contactLinks">
    <a className="contactLink" href="https://www.google.com/maps/search/?api=1&query=Unit+7+120+Falcon+Street+London+Ontario+N5W+4Z1" target="_blank" rel="noreferrer"><MapPinIcon/><span>Unit 7 - 120 Falcon Street<br/>London, Ontario N5W 4Z1</span></a>
    <a className="contactLink" href="tel:+15486899097"><PhoneIcon/><span>(548) 689-9097</span></a>
    <a className="contactLink" href="mailto:falconauto47@gmail.com"><MailIcon/><span>falconauto47@gmail.com</span></a>
  </div>
  <div className="contactLinks">
    <a className="contactLink" href="https://www.instagram.com/falcon.auto.fix/" target="_blank" rel="noreferrer"><InstagramIcon/><span>@falcon.auto.fix</span></a>
    <p>Repairs • Diagnostics • Maintenance</p>
  </div>
</div><div className="container footerBottom"><span>© 2026 Falcon Auto Fix. All rights reserved.</span><a href="https://github.com/Krahme1" target="_blank" rel="noreferrer">Developed by Kareem Rahme</a></div></footer>}
