import L from 'leaflet';
import 'leaflet-routing-machine';

export const createCustomIcon = (type: string, completed: boolean = false) => {
  let iconColor = '#00703c'; // Default NEAR green
  let iconClass = 'fas fa-map-marker-alt';
  
  if (completed) {
    iconColor = '#ffc107'; // Yellow for completed
    iconClass = 'fas fa-check-circle';
  } else if (type === 'vendor') {
    iconColor = '#ff6b35'; // Orange for vendors
    iconClass = 'fas fa-utensils';
  } else if (type === 'facility') {
    iconColor = '#8b5cf6'; // Purple for facilities
    iconClass = 'fas fa-info-circle';
  } else if (type === 'event') {
    iconColor = '#2563eb'; // Blue for event locations
    iconClass = 'fas fa-star';
  }

  return L.divIcon({
    html: `<div style="background-color: ${iconColor};" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
             <i class="${iconClass} text-white text-sm"></i>
           </div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const initializeMap = (containerId: string, center: [number, number], zoom: number = 16) => {
  const map = L.map(containerId).setView(center, zoom);

  // Check if OneMap API key is available
  const oneMapKey = import.meta.env.VITE_ONEMAP_API_KEY;
  
  if (oneMapKey) {
    // Use OneMap tiles for Singapore (when API key is available)
    L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.onemap.sg/">OneMap</a> contributors',
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19
    }).addTo(map);
  } else {
    // Fallback to OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
  }

  return map;
};

export const addPinToMap = (map: L.Map, pin: any, onPinClick: (pin: any) => void) => {
  const icon = createCustomIcon(pin.type, pin.completed);
  const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
  
  marker.on('click', () => onPinClick(pin));
  
  return marker;
};

export const updatePinMarker = (marker: L.Marker, pin: any) => {
  const icon = createCustomIcon(pin.type, pin.completed);
  marker.setIcon(icon);
};

// Jurong Lake Gardens bounds
export const JURONG_LAKE_BOUNDS = {
  center: [1.3390, 103.7265] as [number, number],
  bounds: [
    [1.3350, 103.7220], // Southwest
    [1.3430, 103.7310]  // Northeast
  ] as [[number, number], [number, number]]
};
