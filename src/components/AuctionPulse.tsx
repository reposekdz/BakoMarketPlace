import { useState, useEffect } from 'react';
import { Gavel, X } from 'lucide-react';
import { Button } from './ui/button';

interface AuctionPulseProps {
  onOpenAuctions: () => void;
}

export const AuctionPulse = ({ onOpenAuctions }: AuctionPulseProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('auctionPulseDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('auctionPulseDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-primary/10 text-primary-foreground p-2 text-center text-sm relative">
      <div className="container mx-auto flex items-center justify-center gap-4">
         <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        <span>Live auctions are happening now!</span>
        <Button variant="link" className="text-white underline h-auto p-0" onClick={onOpenAuctions}>View Auctions</Button>
      </div>
      <Button variant="ghost" size="icon" className="absolute top-1/2 right-4 -translate-y-1/2 h-7 w-7" onClick={handleDismiss}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};