export interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  duration?: number; // for video/audio in seconds
}

export interface PinData {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'trail' | 'vendor' | 'facility' | 'event';
  completed: boolean;
  vendorName?: string;
  media?: MediaContent[]; // Rich media content for trail challenges
  funFact?: string; // Educational content for trail challenges
}

export const pinData: PinData[] = [
  {
    id: "1",
    name: "Science Park Trail Challenge - Chinese Garden Entrance",
    description: "Traditional pagoda with beautiful lantern displays",
    lat: 1.3387,
    lng: 103.7258,
    type: "trail",
    completed: false,
    media: [
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        caption: "Explore the traditional Chinese architecture and garden design",
        duration: 30
      },
      {
        type: "image", 
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        caption: "Traditional Chinese garden pagoda at sunset"
      },
      {
        type: "audio",
        url: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
        caption: "Listen to traditional Chinese garden ambiance",
        duration: 15
      }
    ],
    funFact: "Chinese gardens are designed to represent natural landscapes in miniature, with each element symbolizing harmony between humans and nature."
  },
  {
    id: "2",
    name: "Science Park Trail Challenge - Japanese Garden Bridge",
    description: "Serene wooden bridge over koi pond",
    lat: 1.3395,
    lng: 103.7265,
    type: "trail",
    completed: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
        caption: "Traditional Japanese wooden bridge architecture"
      },
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        caption: "Watch koi fish swimming beneath the bridge",
        duration: 20
      }
    ],
    funFact: "Japanese garden bridges are built without nails, using traditional joinery techniques that have been passed down for centuries."
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
    name: "North Carpark",
    description: "Main parking area near Forest Ramble and Clusia Cove (173 car lots)",
    lat: 1.3402,
    lng: 103.7238,
    type: "facility",
    completed: false
  },
  {
    id: "15",
    name: "South Carpark",
    description: "Parking area near ActiveSG and Grasslands (171 car lots) at 50 Yuan Ching Road",
    lat: 1.3387,
    lng: 103.7267,
    type: "facility",
    completed: false
  },
  {
    id: "16",
    name: "Clusia Cove Toilet",
    description: "Restroom facilities with changing areas at water play area (104 Yuan Ching Road)",
    lat: 1.3404,
    lng: 103.7243,
    type: "facility",
    completed: false
  },
  {
    id: "17",
    name: "Forest Ramble Toilet",
    description: "Restroom between Otter Play and Monkey Play areas with nursing room",
    lat: 1.3408,
    lng: 103.7245,
    type: "facility",
    completed: false
  },
  {
    id: "18",
    name: "Japanese Garden Toilet",
    description: "Public restroom facilities in Japanese Garden area",
    lat: 1.3395,
    lng: 103.7275,
    type: "facility",
    completed: false
  },
  {
    id: "19",
    name: "Entrance Pavilion",
    description: "Main visitor information center with maps and guides",
    lat: 1.3405,
    lng: 103.7225,
    type: "facility",
    completed: false
  },
  {
    id: "20",
    name: "Water Lily Pavilion",
    description: "Lakeside visitor services location with staff assistance",
    lat: 1.3385,
    lng: 103.7270,
    type: "facility",
    completed: false
  }
];
