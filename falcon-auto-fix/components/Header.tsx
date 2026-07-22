import Link from "next/link";

export function Header() {
  return <header className="siteHeader"><div className="container nav">
    <Link className="brand brandWithLogo" href="/">
      <img src="/falcon-logo.jpg" alt="Falcon Auto Fix logo" className="brandLogo" />
      <span className="brandWords"><strong>FALCON</strong><small>AUTO FIX</small></span>
    </Link>
    <nav><Link href="/services">Services</Link><Link href="/book">Book</Link><Link href="/contact">Contact</Link><a href="tel:+15486899097">Call</a></nav>
    <Link className="button small" href="/book">Book Appointment</Link>
  </div></header>;
}
