import { COMPANY_DETAILS } from "@/constants";
import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you shortly.");
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gold-text-gradient">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          Have questions or need a consultation? Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm mb-2">Call us for immediate assistance.</p>
                <div className="flex flex-col">
                  {COMPANY_DETAILS.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone}`} className="text-gold-500 font-bold hover:underline">{phone}</a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground text-sm mb-2">Send us your detailed requirements.</p>
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-gold-500 font-bold hover:underline">
                  {COMPANY_DETAILS.email}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Location</h3>
                <p className="text-muted-foreground text-sm mb-1">{COMPANY_DETAILS.location}</p>
                <p className="text-xs text-muted-foreground">Available for projects nationwide.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gold-500/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                <p className="text-muted-foreground text-sm">Sat - Thu: 9:00 AM - 8:00 PM</p>
                <p className="text-muted-foreground text-sm">Friday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form & Map */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-secondary/50 border-gold-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Full name" required className="bg-black border-gold-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="email@example.com" required className="bg-black border-gold-500/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" required className="bg-black border-gold-500/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." required className="bg-black border-gold-500/20 min-h-[150px]" />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold h-14 text-lg">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <div className="aspect-video rounded-2xl overflow-hidden border border-gold-500/20 grayscale hover:grayscale-0 transition-all duration-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116334.81432884102!2d88.87413550379895!3d24.84883908851412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc92225339d675%3A0x673993356e9f138a!2sNaogaon%20Sadar%20Upazila!5e0!3m2!1sen!2sbd!4v1712580000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
