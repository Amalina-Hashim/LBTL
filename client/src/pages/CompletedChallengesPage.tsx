import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Calendar, Trophy, Star } from 'lucide-react';
import { pinData } from '@/data/pinData';

interface CompletedChallenge {
  id: string;
  name: string;
  description: string;
  type: string;
  completedAt: string;
  lat: number;
  lng: number;
  media?: Array<{
    type: 'image' | 'video' | 'audio';
    url: string;
    caption?: string;
    duration?: number;
  }>;
  funFact?: string;
}

export default function CompletedChallengesPage() {
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);

  useEffect(() => {
    // Get completed pins from localStorage
    const savedCompletedPins = localStorage.getItem('completedPins');
    const completedPinIds = savedCompletedPins ? JSON.parse(savedCompletedPins) : [];
    
    // Get completion timestamps from localStorage
    const savedCompletionTimes = localStorage.getItem('completionTimes');
    const completionTimes = savedCompletionTimes ? JSON.parse(savedCompletionTimes) : {};
    
    // Filter and map completed challenges
    const completed = pinData
      .filter(pin => pin.type === 'trail' && completedPinIds.includes(pin.id))
      .map(pin => ({
        ...pin,
        completedAt: completionTimes[pin.id] || new Date().toISOString()
      }))
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    setCompletedChallenges(completed);
    console.log('Loaded completed challenges:', completed);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/event">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Map</span>
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Completed Challenges</h1>
                <p className="text-sm text-gray-600">
                  {completedChallenges.length} of 6 trail challenges completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {completedChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Challenges Completed Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start exploring the Science Park Trail to complete your first challenge!
            </p>
            <Link href="/event">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Explore Trail Challenges
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {challenge.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(challenge.completedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(challenge.completedAt)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Star className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 mb-3">{challenge.description}</p>
                  
                  {challenge.funFact && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Fun Fact:</strong> {challenge.funFact}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {challenge.lat.toFixed(4)}, {challenge.lng.toFixed(4)}</span>
                  </div>
                  
                  {challenge.media && challenge.media.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Challenge Media:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {challenge.media.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item.type} {item.caption && `- ${item.caption}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}