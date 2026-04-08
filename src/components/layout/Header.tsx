import { Link } from "react-router-dom";
import { Menu, X, Phone, MessageSquare, Home, ClipboardList, Briefcase, FolderKanban, FileText, LucideIcon, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShareButton } from "@/components/ShareButton";

import { COMPANY_DETAILS, NAV_LINKS } from "@/constants";

const iconMap: Record<string, LucideIcon> = {
  Home,
  ClipboardList,
  Briefcase,
  FolderKanban,
  FileText,
  Phone,
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter gold-text-gradient sm:text-2xl uppercase">
              {COMPANY_DETAILS.name.split(" & ")[0]}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-300 sm:text-xs">
              & {COMPANY_DETAILS.name.split(" & ")[1]}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-gold-400"
            >
              {item.name}
            </Link>
          ))}
          <ShareButton className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10" />
          <Button render={<Link to="/request-manpower" />} className="bg-gold-500 text-black hover:bg-gold-600 font-bold">
            Hire Now
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 lg:hidden">
          <ShareButton className="text-gold-500 h-9 w-9" />
          <a href={`tel:${COMPANY_DETAILS.phones[0]}`} className="text-gold-500">
            <Phone className="h-5 w-5" />
          </a>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              nativeButton={true}
              render={
                <Button variant="ghost" size="icon" className="text-gold-500">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-black border-gold-500/20 text-white">
              <div className="flex flex-col gap-6 mt-10">
                {NAV_LINKS.map((item) => {
                  const Icon = iconMap[item.icon || "Home"];
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-muted-foreground hover:text-gold-400 flex items-center gap-3"
                    >
                      {Icon && <Icon className="h-5 w-5 text-gold-500" />}
                      {item.name}
                    </Link>
                  );
                })}
                <Button render={<Link to="/request-manpower" onClick={() => setIsOpen(false)} />} className="bg-gold-500 text-black hover:bg-gold-600 font-bold w-full">
                  Hire Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
