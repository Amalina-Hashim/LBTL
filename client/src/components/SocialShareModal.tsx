import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram, Twitter, Share2, Star, MapPin, Calendar, Check } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating?: number;
  review: string;
  locationName: string;
  userName?: string;
  photoUrl?: string;
  postType?: 'rating' | 'completion';
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  textColor: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    bgColor: 'bg-blue-600',
    textColor: 'text-white'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    bgColor: 'bg-pink-600',
    textColor: 'text-white'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    bgColor: 'bg-sky-600',
    textColor: 'text-white'
  }
];

export default function SocialShareModal({ 
  isOpen, 
  onClose, 
  rating = 0, 
  review, 
  locationName, 
  userName = "Nature Explorer",
  photoUrl,
  postType = 'rating'
}: SocialShareModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  const generatePost = (platform: string) => {
    const hashtags = '#LightsByTheLake #JurongLakeGardens #NParks #Singapore #NatureExplorer';
    
    let basePost = '';
    if (postType === 'completion') {
      basePost = `🎉 Just completed the ${locationName} challenge during Lights by the Lake!\n\n${review || 'What an amazing experience exploring Singapore\'s natural beauty!'}\n\n${hashtags}`;
    } else {
      const stars = rating > 0 ? '⭐'.repeat(rating) : '';
      basePost = `Just visited ${locationName} during Lights by the Lake! ${stars}\n\n${review}\n\n${hashtags}`;
    }
    
    switch (platform) {
      case 'facebook':
        return `🌿 ${basePost}\n\n📍 Check out this amazing spot at Jurong Lake Gardens!`;
      case 'instagram':
        return `${basePost}\n\n📸 Swipe to see more photos from this beautiful location!`;
      case 'twitter':
        return `${basePost.substring(0, 200)}...`; // Twitter character limit
      default:
        return basePost;
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to share to.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    
    // Create post content for community wall
    const postContent = generatePostContent();
    
    // Create community post
    try {
      const { createPost } = await import('@/lib/firebase');
      await createPost({
        username: userName || 'Trail Explorer',
        location: locationName,
        imageUrl: photoUrl || '',
        caption: postContent,
        likes: 0,
        comments: 0,
        userId: 'anonymous', // Since we're using anonymous auth
        createdAt: new Date(),
      });
      
      toast({
        title: "Posted to Community!",
        description: "Your achievement has been shared with the community.",
      });
    } catch (error) {
      console.error('Error creating community post:', error);
      // Continue with social media simulation even if community post fails
    }
    
    // Simulate sharing delay for social platforms
    for (const platform of selectedPlatforms) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSharedPlatforms(prev => [...prev, platform]);
      
      const platformName = socialPlatforms.find(p => p.id === platform)?.name;
      toast({
        title: `Shared to ${platformName}!`,
        description: `Your review has been posted to ${platformName}.`,
      });
    }
    
    setIsSharing(false);
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
      setSelectedPlatforms([]);
      setSharedPlatforms([]);
    }, 2000);
  };

  const renderStars = (rating: number) => {
    if (rating === 0) return null;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">{userName}</span>
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {locationName}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {rating > 0 && <div className="flex">{renderStars(rating)}</div>}
                    <span className="text-sm text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Just now
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">
                    {postType === 'completion' 
                      ? (review || 'What an amazing experience exploring Singapore\'s natural beauty!')
                      : review
                    }
                  </p>
                  <div className="text-xs text-primary">
                    #LightsByTheLake #JurongLakeGardens #NParks #Singapore
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Select platforms to share:</h3>
            <div className="grid grid-cols-1 gap-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                const isShared = sharedPlatforms.includes(platform.id);
                
                return (
                  <button
                    key={platform.id}
                    onClick={() => !isSharing && togglePlatform(platform.id)}
                    disabled={isSharing}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${isSharing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.bgColor}`}>
                        <Icon className={`w-4 h-4 ${platform.textColor}`} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{platform.name}</div>
                        <div className="text-xs text-gray-500">
                          {generatePost(platform.id).substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                    {isShared && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            disabled={selectedPlatforms.length === 0 || isSharing}
            className="w-full"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sharing... ({sharedPlatforms.length}/{selectedPlatforms.length})
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}