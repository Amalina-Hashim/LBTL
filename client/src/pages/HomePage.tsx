import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Star, Play, QrCode, Camera, Utensils } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative hero-bg text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Singapore's<br />Natural Wonders
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with nature through immersive experiences, interactive trails, and community engagement
            </p>
            <Link href="/event">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Event Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Event</h2>
          <p className="text-lg text-gray-600">Don't miss our signature experiences</p>
        </div>

        {/* Event Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer">
            <Link href="/event">
              <CardContent className="p-0">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                      alt="Beautiful Chinese Garden at Jurong Lake Gardens with traditional pagoda and lanterns" 
                      className="w-full h-64 md:h-full object-cover" 
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Live Event
                      </span>
                      <span className="ml-3 text-gray-600">Dec 15 - Jan 15, 2024</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      Lights by the Lake
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Experience the magic of Jurong Lake Gardens transformed into a wonderland of lights. 
                      Complete the Science Park Trail challenge, discover hidden gems, and share your journey with the community.
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="text-primary mr-3 w-5 h-5" />
                        <span>Jurong Lake Gardens</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="text-primary mr-3 w-5 h-5" />
                        <span>1,247 participants</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Star className="text-primary mr-3 w-5 h-5" />
                        <span>4.8/5 rating</span>
                      </div>
                    </div>

                    <Button className="w-full py-4 text-lg">
                      <Play className="w-5 h-5 mr-2" />
                      Start Trail Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Features</h2>
            <p className="text-lg text-gray-600">Everything you need for an amazing experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Trail Challenge</h3>
                <p className="text-gray-600">Discover 8-10 hidden locations throughout the Science Park Trail</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Photo Sharing</h3>
                <p className="text-gray-600">Capture and share your favorite moments with the community</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Night Bazaar</h3>
                <p className="text-gray-600">Rate and review local food vendors at the night market</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
