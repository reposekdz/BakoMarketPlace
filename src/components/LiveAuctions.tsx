import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from './ui/drawer';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Gavel, Flame, Users, Clock, ShoppingCart, X } from 'lucide-react';

const mockAuctions = [
    { id: 'auction-1', name: 'Vintage Leather Sofa', currentBid: 450, timeLeft: '2h 30m', bidders: 12, image: 'https://picsum.photos/seed/sofa/400/300', isHot: true },
    { id: 'auction-2', name: 'Antique Grandfather Clock', currentBid: 800, timeLeft: '1h 15m', bidders: 8, image: 'https://picsum.photos/seed/clock/400/300', isHot: false },
    { id: 'auction-3', name: 'Modern Art Piece "Eclipse"', currentBid: 1200, timeLeft: '4h 45m', bidders: 25, image: 'https://picsum.photos/seed/art/400/300', isHot: true },
];

const AuctionCard = ({ auction, onBid }: { auction: any, onBid: (id: string, amount: number) => void }) => {
    const [bidAmount, setBidAmount] = useState(auction.currentBid + 50);

    return (
        <div className="border rounded-lg p-4 flex gap-4 items-center bg-white">
            <img src={auction.image} alt={auction.name} className="w-32 h-32 object-cover rounded-md" />
            <div className="flex-1">
                <h4 className="font-semibold text-lg">{auction.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1"><Gavel className="w-4 h-4" /><span>${auction.currentBid}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{auction.bidders}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{auction.timeLeft}</span></div>
                    {auction.isHot && <div className="flex items-center gap-1 text-red-500"><Flame className="w-4 h-4" /><span>Hot</span></div>}
                </div>
                <div className="mt-3 flex gap-2">
                     <input 
                        type="number" 
                        value={bidAmount} 
                        onChange={e => setBidAmount(parseInt(e.target.value))}
                        className="w-24 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        min={auction.currentBid + 1}
                        step="10"
                    />
                    <Button size="sm" onClick={() => onBid(auction.id, bidAmount)}>Place Bid</Button>
                    <Button size="sm" variant="outline">Watch</Button>
                </div>
            </div>
        </div>
    );
};

export const LiveAuctionsDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [auctions, setAuctions] = useState(mockAuctions);

    const handleBid = (id: string, amount: number) => {
        setAuctions(prev => 
            prev.map(a => a.id === id ? { ...a, currentBid: amount, bidders: a.bidders + 1 } : a)
        );
        // In a real app, you'd show a toast or confirmation here
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="max-h-[80vh] bg-gray-50">
                <div className="mx-auto w-full max-w-4xl">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2 text-2xl">
                            <Gavel /> Live Auctions
                        </DrawerTitle>
                        <DrawerDescription>Bid on unique items in real-time. New items added daily.</DrawerDescription>
                         <DrawerClose asChild className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto">
                        <Tabs defaultValue="all">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="all">All Items ({auctions.length})</TabsTrigger>
                                <TabsTrigger value="hot">Hot Deals ({auctions.filter(a => a.isHot).length})</TabsTrigger>
                                <TabsTrigger value="ending-soon">Ending Soon</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <div className="space-y-4">
                                    {auctions.map(auction => (
                                        <AuctionCard key={auction.id} auction={auction} onBid={handleBid} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="hot">
                                <div className="space-y-4">
                                    {auctions.filter(a => a.isHot).map(auction => (
                                        <AuctionCard key={auction.id} auction={auction} onBid={handleBid} />
                                    ))}
                                </div>
                            </TabsContent>
                             <TabsContent value="ending-soon">
                                <p className="text-center text-gray-500 py-8">No auctions ending soon.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DrawerFooter>
                        <p className="text-xs text-center text-gray-500">Auction items are subject to different terms and shipping policies.</p>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
