import { COMPANY_DETAILS } from "@/constants";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, HardHat, ShieldCheck, Clock, Phone, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
            alt="Construction background"
            className="h-full w-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Reliable Construction <br />
              <span className="gold-text-gradient">Manpower Supply</span> <br />
              in Bangladesh
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Providing skilled Rod Mistry, Raj Mistry, Helper, Welder, and Fitter for your construction projects nationwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button render={<Link to="/request-manpower" />} size="lg" className="bg-gold-500 text-black hover:bg-gold-600 font-bold px-8 h-14 text-lg w-full sm:w-auto">
                Request Manpower
              </Button>
              <Button render={<Link to="/work-with-us" />} size="lg" variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10 font-bold px-8 h-14 text-lg w-full sm:w-auto">
                I Want to Work
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats or Badges */}
        <div className="absolute bottom-10 left-0 w-full overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-12 text-gold-500/30 text-2xl font-black uppercase tracking-widest">
            <span>Rod Mistry</span>
            <span>Raj Mistry</span>
            <span>Helper</span>
            <span>Welder</span>
            <span>Fitter</span>
            <span>Electrician</span>
            <span>Plumber</span>
            <span>Rod Mistry</span>
            <span>Raj Mistry</span>
            <span>Helper</span>
            <span>Welder</span>
            <span>Fitter</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-bold text-gold-500 uppercase tracking-[0.3em] mb-4">About Our Company</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Building the Future with <br />
                <span className="gold-text-gradient">Skilled Hands</span>
              </h3>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {COMPANY_DETAILS.name} is a premier manpower provider in Bangladesh. Led by {COMPANY_DETAILS.proprietor}, we specialize in supplying highly skilled labor for large-scale construction projects in Chattogram, Dhaka, and beyond.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Verified Workers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-medium">On-time Delivery</span>
                </div>
              </div>
              <Button render={<Link to="/contact" />} variant="link" className="text-gold-500 p-0 h-auto text-lg font-bold group">
                <span className="flex items-center gap-2">
                  Learn More About Us <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gold-500/20">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                  alt="Construction work"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold-500 text-black p-8 rounded-xl shadow-2xl hidden md:block">
                <div className="text-4xl font-black mb-1">10+</div>
                <div className="text-sm font-bold uppercase tracking-wider">Years of Experience</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-gold-500 uppercase tracking-[0.3em] mb-4">Our Services</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Expert Manpower for Every Need</h3>
            <p className="text-muted-foreground text-lg">
              We provide specialized labor teams for various construction sectors, ensuring quality and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Rod Mistry", icon: HardHat, desc: "Expert reinforcement workers for RCC structures." },
              { title: "Raj Mistry", icon: Users, desc: "Skilled masons for brickwork, plastering, and finishing." },
              { title: "Welder & Fitter", icon: ShieldCheck, desc: "Certified welders for structural steel works." },
              { title: "Helpers", icon: Users, desc: "Hardworking assistants to speed up your project." },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary p-8 rounded-2xl border border-gold-500/10 hover:border-gold-500/40 transition-all group"
              >
                <div className="h-14 w-14 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                  <service.icon className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gold-500/10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Contact us today for a consultation and get the best manpower rates in the industry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button render={<Link to="/request-manpower" />} size="lg" className="bg-gold-500 text-black hover:bg-gold-600 font-bold px-10 h-14 text-lg">
              Request Manpower Now
            </Button>
            <a href={`tel:${COMPANY_DETAILS.phones[0]}`} className="text-xl font-bold flex items-center gap-2 hover:text-gold-500 transition-colors">
              <Phone className="h-6 w-6" /> {COMPANY_DETAILS.phones[0]}
            </a>
          </div>

          {/* Admin Login Button */}
          <div className="pt-12 border-t border-gold-500/10">
            <Button 
              render={<Link to="/admin/login" />} 
              variant="ghost" 
              className="text-muted-foreground hover:text-gold-500 text-sm flex items-center gap-2 mx-auto"
            >
              <Lock className="h-4 w-4" /> Admin Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
