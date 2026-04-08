import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, HardHat } from "lucide-react";

const projects = [
  {
    title: "Commercial Building",
    location: "Chattogram",
    type: "RCC Structure",
    image: "https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Residential Complex",
    location: "Dhaka",
    type: "Brickwork & Finishing",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Industrial Shed",
    location: "Gazipur",
    type: "Steel Structure & Welding",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Bridge Construction",
    location: "Naogaon",
    type: "Reinforcement Work",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Shopping Mall",
    location: "Sylhet",
    type: "Full Manpower Supply",
    image: "https://images.unsplash.com/photo-1555633514-abcee6ad93e1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Luxury Villa",
    location: "Cox's Bazar",
    type: "Premium Finishing",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gold-text-gradient">Our Projects</h1>
        <p className="text-muted-foreground text-lg">
          Take a look at some of the major construction projects where we have successfully supplied skilled manpower.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-secondary border-gold-500/10 overflow-hidden group hover:border-gold-500/40 transition-all">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-gold-500 font-bold">View Details</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-gold-500 transition-colors">{project.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-gold-500" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HardHat className="h-4 w-4 text-gold-500" />
                    <span>{project.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
