export interface PinData {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'trail' | 'vendor' | 'facility' | 'event';
  completed: boolean;
  vendorName?: string;
}

export const pinData: PinData[] = [
  {
    id: "1",
    name: "Science Park Trail Challenge - Chinese Garden Entrance",
    description: "Traditional pagoda with beautiful lantern displays",
    lat: 1.3387,
    lng: 103.7258,
    type: "trail",
    completed: false
  },
  {
    id: "2",
    name: "Science Park Trail Challenge - Japanese Garden Bridge",
    description: "Serene wooden bridge over koi pond",
    lat: 1.3395,
    lng: 103.7265,
    type: "trail",
    completed: false
  },
  {
    id: "3",
    name: "Satay King Stall",
    description: "Award-winning satay vendor",
    lat: 1.3380,
    lng: 103.7270,
    type: "vendor",
    completed: false,
    vendorName: "Satay King"
  },
  {
    id: "4",
    name: "Science Park Trail Challenge - Lakeside Pavilion",
    description: "Perfect spot for lake views and photos",
    lat: 1.3405,
    lng: 103.7240,
    type: "trail",
    completed: false
  },
  {
    id: "5",
    name: "Science Park Trail Challenge - Lotus Pond",
    description: "Beautiful lotus flowers and peaceful atmosphere",
    lat: 1.3390,
    lng: 103.7280,
    type: "trail",
    completed: false
  },
  {
    id: "6",
    name: "Night Market Center",
    description: "Hub of food vendors and entertainment",
    lat: 1.3375,
    lng: 103.7250,
    type: "vendor",
    completed: false,
    vendorName: "Night Market Hub"
  },
  {
    id: "7",
    name: "Science Park Trail Challenge - Bamboo Grove",
    description: "Tranquil bamboo forest path",
    lat: 1.3398,
    lng: 103.7275,
    type: "trail",
    completed: false
  },
  {
    id: "8",
    name: "Science Park Trail Challenge - Scenic Overlook",
    description: "Panoramic views of the entire gardens",
    lat: 1.3410,
    lng: 103.7285,
    type: "trail",
    completed: false
  },
  {
    id: "9",
    name: "Rest Area",
    description: "Toilets and seating area",
    lat: 1.3385,
    lng: 103.7245,
    type: "facility",
    completed: false
  },
  {
    id: "10",
    name: "Laksa Paradise",
    description: "Authentic laksa and noodle dishes",
    lat: 1.3395,
    lng: 103.7255,
    type: "vendor",
    completed: false,
    vendorName: "Laksa Paradise"
  },
  {
    id: "11",
    name: "Lights by the Lake - Cloud Pagoda Projection",
    description: "Experience the 'Mid-Autumn Symphony' projection mapping every 30 minutes from 7:30-9:30 PM",
    lat: 1.3388,
    lng: 103.7260,
    type: "event",
    completed: false
  },
  {
    id: "12", 
    name: "Lights by the Lake - Dragon Phoenix Bridge",
    description: "Walk through the illuminated White Rainbow Bridge transformed with dragon and phoenix lanterns",
    lat: 1.3392,
    lng: 103.7268,
    type: "event",
    completed: false
  },
  {
    id: "13",
    name: "Lights by the Lake - Japanese Garden Sunken Garden",
    description: "Discover the 'Everglow' installation blending nature and technology with mist and lighting effects",
    lat: 1.3396,
    lng: 103.7273,
    type: "event", 
    completed: false
  },
  {
    id: "14",
    name: "Chinese Garden Toilet",
    description: "Public restroom facilities near Chinese Garden entrance",
    lat: 1.3385,
    lng: 103.7255,
    type: "facility",
    completed: false
  },
  {
    id: "15",
    name: "Japanese Garden Toilet",
    description: "Public restroom facilities in Japanese Garden area",
    lat: 1.3398,
    lng: 103.7278,
    type: "facility",
    completed: false
  },
  {
    id: "16",
    name: "Lakeside Carpark A",
    description: "Main parking area near lake entrance",
    lat: 1.3375,
    lng: 103.7235,
    type: "facility",
    completed: false
  },
  {
    id: "17",
    name: "Chinese Garden Carpark",
    description: "Parking area near Chinese Garden entrance",
    lat: 1.3382,
    lng: 103.7252,
    type: "facility",
    completed: false
  },
  {
    id: "18",
    name: "Shelter Pavilion 1",
    description: "Covered seating area with benches",
    lat: 1.3392,
    lng: 103.7262,
    type: "facility",
    completed: false
  },
  {
    id: "19",
    name: "Shelter Pavilion 2",
    description: "Covered rest area with lake views",
    lat: 1.3408,
    lng: 103.7272,
    type: "facility",
    completed: false
  },
  {
    id: "20",
    name: "Visitor Information Center",
    description: "Maps, guides and visitor assistance",
    lat: 1.3378,
    lng: 103.7248,
    type: "facility",
    completed: false
  }
];
