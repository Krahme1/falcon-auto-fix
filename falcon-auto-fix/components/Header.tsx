import Link from "next/link";
export function Header() {
  return <header className="siteHeader"><div className="container nav">
    <Link className="brand" href="/"><span>FALCON</span><small>AUTO FIX</small></Link>
    <nav><Link href="/services">Services</Link><Link href="/book">Book</Link><Link href="/contact">Contact</Link><a href="tel:+15486899097">Call</a></nav>
    <Link className="button small" href="/book">Book Appointment</Link>
  </div></header>;
}
