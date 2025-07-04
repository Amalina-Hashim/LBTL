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
        type: "image", 
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        caption: "🏮 Traditional Chinese lanterns creating magical festival atmosphere"
      },
      {
        type: "image", 
        url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop&q=60",
        caption: "🏯 Beautiful Chinese garden pagoda with lantern decorations"
      },
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        caption: "🎬 Beautiful red lanterns swaying in the breeze during Chinese New Year festival",
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
        url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop&q=60",
        caption: "🎋 Beautiful Japanese garden bridge perfect for lantern festival viewing"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        caption: "🏮 Traditional wooden bridge with lantern reflections in water"
      },
      {
        type: "video",
        url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        caption: "🎬 Colorful lanterns floating on water during traditional lantern festival",
        duration: 25
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
    completed: false,
    media: [
      {
        type: "video",
        url: "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_25fps.mp4",
        caption: "Magnificent lantern festival celebration with thousands of colorful lanterns",
        duration: 20
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        caption: "🏮 Traditional Chinese lanterns creating magical atmosphere during festival"
      }
    ],
    funFact: "Lantern festivals originated over 2,000 years ago during the Han Dynasty, symbolizing the return of spring and new beginnings."
  },
  {
    id: "5",
    name: "Science Park Trail Challenge - Lotus Pond",
    description: "Beautiful lotus flowers and peaceful atmosphere",
    lat: 1.3390,
    lng: 103.7280,
    type: "trail",
    completed: false,
    media: [
      {
        type: "video",
        url: "https://videos.pexels.com/video-files/7655277/7655277-sd_640_360_25fps.mp4",
        caption: "Stunning sky lanterns floating up into the night sky during festival",
        duration: 18
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Beautiful lotus pond with traditional lanterns reflected in water"
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/1677675/pexels-photo-1677675.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Colorful paper lanterns hanging above lotus pond"
      },
      {
        type: "audio",
        url: "https://www.soundjay.com/misc/sounds/water-drop-2.wav",
        caption: "Peaceful lotus pond with gentle water sounds and nature ambiance",
        duration: 35
      }
    ],
    funFact: "Lotus flowers bloom only during the day and close at night, symbolizing rebirth and purity in Chinese culture - perfect for lantern festivals celebrating new beginnings."
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
    completed: false,
    media: [
      {
        type: "video",
        url: "https://videos.pexels.com/video-files/2064827/2064827-sd_640_360_25fps.mp4",
        caption: "Traditional Chinese dragon dance performance during lantern festival",
        duration: 22
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Enchanting bamboo grove illuminated by traditional red lanterns"
      },
      {
        type: "audio",
        url: "https://www.soundjay.com/misc/sounds/bamboo-wind-chimes.wav",
        caption: "Relaxing bamboo grove sounds with gentle wind through leaves",
        duration: 40
      }
    ],
    funFact: "Bamboo symbolizes strength and flexibility in Chinese culture - it bends without breaking, representing resilience during life's challenges."
  },
  {
    id: "8",
    name: "Science Park Trail Challenge - Scenic Overlook",
    description: "Panoramic views of the entire gardens",
    lat: 1.3410,
    lng: 103.7285,
    type: "trail",
    completed: false,
    media: [
      {
        type: "video",
        url: "https://videos.pexels.com/video-files/7655277/7655277-sd_640_360_25fps.mp4",
        caption: "Spectacular aerial view of lantern festival with hundreds of floating lanterns",
        duration: 30
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Panoramic view of entire gardens decorated with colorful lanterns"
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800",
        caption: "Breathtaking sunset view with traditional Chinese lanterns"
      },
      {
        type: "audio",
        url: "https://www.soundjay.com/misc/sounds/festival-crowd.wav",
        caption: "Joyful festival atmosphere with distant music and celebration sounds",
        duration: 45
      }
    ],
    funFact: "The scenic overlook offers the best view of the entire Lantern Festival - historically, elevated viewing spots were reserved for nobility during imperial celebrations."
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
