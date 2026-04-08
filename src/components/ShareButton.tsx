import React, { useState } from "react";
import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = window.location.origin;
  const shareTitle = "Sohanur Construction & Manpower Solution - Reliable Manpower Supply in Bangladesh";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2]",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366]",
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, "_blank"),
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2]",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className={className}>
            <Share2 className="h-5 w-5" />
          </Button>
        }
      />
      <DialogContent className="bg-black border-gold-500/20 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gold-text-gradient">Share Website</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-6">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              onClick={option.action}
              className={`${option.color} text-white hover:opacity-90 font-bold flex items-center gap-2 h-12`}
            >
              <option.icon className="h-5 w-5" />
              {option.name}
            </Button>
          ))}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-gold-500 text-gold-500 hover:bg-gold-500/10 font-bold flex items-center gap-2 h-12"
          >
            <LinkIcon className="h-5 w-5" />
            Copy Link
          </Button>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Spread the word about our services
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
