import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Trophy, Eye, Camera, Star, Route, Navigation, MapPin } from "lucide-react";
import { pinData, PinData } from "@/data/pinData";
import { initializeMap, addPinToMap, updatePinMarker, JURONG_LAKE_BOUNDS } from "@/lib/mapUtils";
import L from 'leaflet';
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
  const [routingMode, setRoutingMode] = useState(false);
  const [routeCreated, setRouteCreated] = useState(false);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [walkingPath, setWalkingPath] = useState<L.Polyline | null>(null);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize map when component mounts
    const leafletMap = initializeMap('map', JURONG_LAKE_BOUNDS.center, 16);
    setMap(leafletMap);

    // Track page view
    trackAnalytics('page_view', { page: 'event_map' });

    // Cleanup
    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, []);

  // Create a memoized pin click handler that captures current routing mode
  const currentPinClickHandler = useCallback((pin: PinData) => {
    console.log('Pin clicked:', pin.name, 'Routing mode (current):', routingMode, 'Route created:', routeCreated);
    
    // If routing mode is active but route is already created, allow normal pin interactions
    if (routingMode && routeCreated) {
      setSelectedPin(pin);
      setIsModalOpen(true);
      trackAnalytics('pin_click', { pinId: pin.id, pinType: pin.type });
      return;
    }
    
    if (routingMode && !routeCreated) {
      const pinLatLng = L.latLng(pin.lat, pin.lng);
      console.log('Creating LatLng:', pinLatLng);
      
      if (!startPoint) {
        setStartPoint(pinLatLng);
        console.log('Setting start point:', pinLatLng);
        toast({
          title: "Start Point Set",
          description: `Starting route from ${pin.name}`,
        });
      } else if (!endPoint) {
        setEndPoint(pinLatLng);
        console.log('Setting end point and creating route');
        createRoute(startPoint, pinLatLng);
        setRouteCreated(true);
        toast({
          title: "Route Created",
          description: `Route planned to ${pin.name}. You can now click pins to explore them!`,
        });
      }
    } else {
      setSelectedPin(pin);
      setIsModalOpen(true);
      trackAnalytics('pin_click', { pinId: pin.id, pinType: pin.type });
    }
  }, [routingMode, routeCreated, startPoint, endPoint, map]);

  // Separate effect to handle pins and routing mode changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    pinMarkers.forEach(marker => map.removeLayer(marker));

    // Add pins to map with current handlePinClick
    const markerMap = new Map<string, L.Marker>();
    pins.forEach(pin => {
      const marker = addPinToMap(map, pin, currentPinClickHandler);
      markerMap.set(pin.id, marker);
    });
    setPinMarkers(markerMap);
  }, [map, currentPinClickHandler, pins]);

  const createRoute = (start: L.LatLng, end: L.LatLng) => {
    console.log('createRoute called with:', start, end);
    if (!map) {
      console.log('No map available');
      return;
    }

    console.log('Map available, creating route');

    // Clear existing route
    if (routingControl) {
      console.log('Removing existing route');
      map.removeLayer(routingControl);
    }

    // Clear existing markers
    if (startMarker) {
      console.log('Removing existing start marker');
      map.removeLayer(startMarker);
    }
    if (endMarker) {
      console.log('Removing existing end marker');
      map.removeLayer(endMarker);
    }

    // Create start marker (green)
    const startIcon = L.divIcon({
      html: `<div style="background-color: #00703c;" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
               <i class="fas fa-play text-white text-sm"></i>
             </div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Create end marker (red)
    const endIcon = L.divIcon({
      html: `<div style="background-color: #dc2626;" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
               <i class="fas fa-flag text-white text-sm"></i>
             </div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const newStartMarker = L.marker(start, { icon: startIcon }).addTo(map);
    const newEndMarker = L.marker(end, { icon: endIcon }).addTo(map);
    
    setStartMarker(newStartMarker);
    setEndMarker(newEndMarker);

    // Create simple polyline route (walking path)
    const routeLine = L.polyline([start, end], {
      color: '#00703c',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(map);

    setRoutingControl(routeLine);
    
    // Fit map to show route
    const bounds: L.LatLngBoundsExpression = [[start.lat, start.lng], [end.lat, end.lng]];
    map.fitBounds(bounds, { padding: [20, 20] });
  };

  const clearRoute = () => {
    if (routingControl && map) {
      map.removeLayer(routingControl);
      setRoutingControl(null);
    }
    if (startMarker && map) {
      map.removeLayer(startMarker);
      setStartMarker(null);
    }
    if (endMarker && map) {
      map.removeLayer(endMarker);
      setEndMarker(null);
    }
    setStartPoint(null);
    setEndPoint(null);
    setRouteCreated(false);
  };

  const toggleRoutingMode = () => {
    const newRoutingMode = !routingMode;
    console.log('Toggling routing mode from', routingMode, 'to', newRoutingMode);
    setRoutingMode(newRoutingMode);
    
    if (routingMode) {
      clearRoute();
    }
    
    toast({
      title: routingMode ? "Routing Mode Off" : "Routing Mode On",
      description: routingMode ? 
        "Click pins to view details" : 
        "Click two pins to create a walking route",
    });
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
                <p className="text-sm sm:text-base text-gray-600 truncate">Jurong Lake Gardens Trail Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <span className="font-semibold text-xs sm:text-sm">{completedCount}/{totalTrailPins}</span>
                <span className="hidden sm:inline"> Completed</span>
              </div>
              <Button 
                variant={routingMode ? "default" : "outline"} 
                size="sm" 
                onClick={toggleRoutingMode}
                className="hidden sm:flex"
              >
                <Route className="w-4 h-4 mr-2" />
                {routingMode ? "Exit Route" : "Plan Route"}
              </Button>
              <Button 
                variant={routingMode ? "default" : "outline"} 
                size="sm" 
                onClick={toggleRoutingMode}
                className="sm:hidden"
              >
                <Route className="w-4 h-4" />
              </Button>
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

      {/* Routing Instructions */}
      {routingMode && (
        <div className="bg-blue-50 border border-blue-200 p-3 mx-4 sm:mx-6 lg:mx-8">
          <div className="flex items-center text-blue-800">
            <Navigation className="w-4 h-4 mr-2" />
            <p className="text-sm">
              {!startPoint ? "Click a pin to set your starting point" : 
               !endPoint ? "Click another pin to create your walking route" :
               "Route created! Click 'Exit Route' to return to normal mode"}
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div id="map" className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"></div>
        
        {/* Map Legend - responsive positioning */}
        <Card className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 max-w-[140px] sm:max-w-none ${routingMode ? 'border-blue-500 bg-blue-50' : ''}`}>
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <h3 className="font-semibold text-xs sm:text-sm">Legend</h3>
              {routingMode && (
                <div className="flex items-center text-blue-600">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
            {routingMode ? (
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="text-blue-800 font-medium">🗺️ Route Planning</div>
                <div className="text-blue-700 text-xs">Click two pins to create walking route</div>
                <div className="text-blue-700 text-xs">Click "Exit Route" to return to trail challenges</div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Routing Status Indicator */}
        {routingMode && (
          <div className="absolute bottom-4 left-4 z-10">
            <Card className="border-blue-500 bg-blue-50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between space-x-2 text-blue-800">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5" />
                    <div>
                      <div className="font-medium text-sm">Route Planning Active</div>
                      {!startPoint && !routeCreated && (
                        <div className="text-xs text-blue-700">Click first pin to set start point</div>
                      )}
                      {startPoint && !endPoint && !routeCreated && (
                        <div className="text-xs text-blue-700">Click second pin to create route</div>
                      )}
                      {routeCreated && (
                        <div className="text-xs text-blue-700">Route created! Click pins to explore them</div>
                      )}
                    </div>
                  </div>
                  {routeCreated && (
                    <Button 
                      onClick={() => {
                        clearRoute();
                        toast({
                          title: "Plan New Route",
                          description: "Click two pins to create a new route",
                        });
                      }} 
                      variant="outline" 
                      size="sm"
                      className="text-xs px-2 py-1"
                    >
                      New Route
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
