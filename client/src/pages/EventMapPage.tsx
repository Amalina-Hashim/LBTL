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
  const [pinMarkers, setPinMarkers] = useState<Map<string, L.Marker>>(new Map());
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

    // Add pins to map and store markers
    const markerMap = new Map<string, L.Marker>();
    pins.forEach(pin => {
      const marker = addPinToMap(leafletMap, pin, handlePinClick);
      markerMap.set(pin.id, marker);
    });
    setPinMarkers(markerMap);

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
    
    setCompletedPins(prev => {
      const newSet = new Set(prev);
      newSet.add(pinId);
      return newSet;
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      visits: prev.visits + 1,
      photos: photoFile ? prev.photos + 1 : prev.photos
    }));

    // Update pins state to mark as completed
    setPins(prev => prev.map(p => 
      p.id === pinId ? { ...p, completed: true } : p
    ));

    // Update map marker to yellow
    const marker = pinMarkers.get(pinId);
    if (marker) {
      const pin = pins.find(p => p.id === pinId);
      if (pin) {
        updatePinMarker(marker, { ...pin, completed: true });
      }
    }

    // Check if all trail pins are completed
    const trailPins = pins.filter(p => p.type === 'trail');
    const completedTrailPins = trailPins.filter(p => completedPins.has(p.id) || p.id === pinId);
    
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
            <div className="flex items-center min-w-0 flex-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-2 sm:mr-4 flex-shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Lights by the Lake</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">Science Park Trail Challenge</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <span className="font-semibold text-xs sm:text-sm">{completedCount}/{totalTrailPins}</span>
                <span className="hidden sm:inline"> Completed</span>
              </div>
              <Link href="/community">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <Users className="w-4 h-4" />
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
        <div id="map" className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"></div>
        
        {/* Map Legend - responsive positioning */}
        <Card className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 max-w-[140px] sm:max-w-none">
          <CardContent className="p-2 sm:p-4">
            <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Legend</h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full mr-1 sm:mr-2"></div>
                <span className="truncate">Science Park Trail Challenge</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="truncate">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="truncate">Food Vendors</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="truncate">Facilities</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full mr-1 sm:mr-2"></div>
                <span className="truncate">Lights by the Lake Events</span>
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
