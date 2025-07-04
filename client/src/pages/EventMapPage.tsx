import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Trophy, Eye, Camera, Star } from "lucide-react";
import { pinData, PinData } from "@/data/pinData";
import { initializeMap, addPinToMap, updatePinMarker, JURONG_LAKE_BOUNDS } from "@/lib/mapUtils";
import { trackAnalytics } from "@/lib/firebase";
import PinDetailModal from "@/components/PinDetailModal";
import { useToast } from "@/hooks/use-toast";

export default function EventMapPage() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [pins, setPins] = useState<PinData[]>(pinData);
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedPins, setCompletedPins] = useState<Set<string>>(new Set());
  const [showPrizeBanner, setShowPrizeBanner] = useState(false);
  const [stats, setStats] = useState({
    visits: 23,
    photos: 15,
    ratings: 8
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize map when component mounts
    const leafletMap = initializeMap('map', JURONG_LAKE_BOUNDS.center, 16);
    setMap(leafletMap);

    // Track page view
    trackAnalytics('page_view', { page: 'event_map' });

    // Add pins to map
    pins.forEach(pin => {
      addPinToMap(leafletMap, pin, handlePinClick);
    });

    // Cleanup
    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, []);

  const handlePinClick = (pin: PinData) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
    trackAnalytics('pin_click', { pinId: pin.id, pinType: pin.type });
  };

  const handlePinComplete = (pinId: string, photoFile: File | null) => {
    setPins(prevPins => 
      prevPins.map(pin => 
        pin.id === pinId ? { ...pin, completed: true } : pin
      )
    );
    
    setCompletedPins(prev => new Set([...prev, pinId]));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      visits: prev.visits + 1,
      photos: photoFile ? prev.photos + 1 : prev.photos
    }));

    // Update map marker
    if (map) {
      const pin = pins.find(p => p.id === pinId);
      if (pin && pin.marker) {
        updatePinMarker(pin.marker, { ...pin, completed: true });
      }
    }

    // Check if all trail pins are completed
    const trailPins = pins.filter(p => p.type === 'trail');
    const completedTrailPins = trailPins.filter(p => p.completed || p.id === pinId);
    
    if (completedTrailPins.length >= trailPins.length) {
      setShowPrizeBanner(true);
    }

    toast({
      title: "Check-in Complete!",
      description: "Great job! Location marked as visited.",
    });

    trackAnalytics('pin_complete', { pinId, hasPhoto: !!photoFile });
  };

  const handlePinRate = (pinId: string, rating: number, review: string) => {
    // Update stats
    setStats(prev => ({
      ...prev,
      ratings: prev.ratings + 1
    }));

    toast({
      title: "Rating Submitted!",
      description: "Thank you for your feedback!",
    });

    trackAnalytics('vendor_rating', { pinId, rating, hasReview: !!review });
  };

  const completedCount = completedPins.size;
  const totalTrailPins = pins.filter(p => p.type === 'trail').length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lights by the Lake</h1>
                <p className="text-gray-600">Science Park Trail Challenge</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-white px-4 py-2 rounded-lg">
                <span className="font-semibold">{completedCount}/{totalTrailPins} Completed</span>
              </div>
              <Link href="/community">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Banner */}
      {showPrizeBanner && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-3">
          <div className="flex items-center justify-center">
            <Trophy className="w-5 h-5 mr-2" />
            <span className="font-semibold">Congratulations! Prize Available - Visit Information Counter</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div id="map" className="w-full h-96 md:h-[500px]"></div>
        
        {/* Map Legend */}
        <Card className="absolute top-4 right-4 z-10">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                <span>Trail Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                <span>Food Vendors</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span>Facilities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.visits}</div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.photos}</div>
              <div className="text-sm text-gray-600">Photos Taken</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.ratings}</div>
              <div className="text-sm text-gray-600">Reviews Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Detail Modal */}
      <PinDetailModal
        pin={selectedPin}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handlePinComplete}
        onRate={handlePinRate}
      />
    </div>
  );
}
