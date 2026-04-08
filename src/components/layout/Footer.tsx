import { Link } from "react-router-dom";
import { COMPANY_DETAILS, NAV_LINKS } from "@/constants";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-gold-500/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold gold-text-gradient uppercase">{COMPANY_DETAILS.name.split(" & ")[0]}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Leading manpower supply and construction services in Bangladesh. Providing skilled workers for projects of all sizes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-gold-500 text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Rod Mistry Supply</li>
              <li className="text-muted-foreground text-sm">Raj Mistry Supply</li>
              <li className="text-muted-foreground text-sm">Welder & Fitter</li>
              <li className="text-muted-foreground text-sm">Construction Helper</li>
              <li className="text-muted-foreground text-sm">Project Management</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0" />
                <span>{COMPANY_DETAILS.location}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-gold-500 shrink-0" />
                <div className="flex flex-col">
                  {COMPANY_DETAILS.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone}`} className="hover:text-gold-500">{phone}</a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-gold-500 shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-gold-500">{COMPANY_DETAILS.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sohanur Construction & Manpower Solution. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <Link to="/agreement" className="text-xs text-muted-foreground hover:text-gold-500">Terms & Conditions</Link>
            <Link to="/agreement" className="text-xs text-muted-foreground hover:text-gold-500">Privacy Policy</Link>
            {/* Secret Admin Button */}
            <Link to="/admin/login" className="opacity-0 hover:opacity-10 transition-opacity cursor-default">
              <div className="h-1 w-1 bg-gold-500/10 rounded-full"></div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
