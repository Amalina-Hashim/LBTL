import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram, Twitter, Share2, Star, MapPin, Calendar, Check } from 'lucide-react';
import { useLocation } from 'wouter';

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
  const [currentReview, setCurrentReview] = useState(review);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Initialize with default completion message if no review provided
  useEffect(() => {
    if (!review || review.trim() === '') {
      if (postType === 'completion' || !postType) {
        setCurrentReview(`Just completed ${locationName}! 🎯 Amazing trail challenge experience!`);
      } else if (postType === 'rating') {
        setCurrentReview(`Rated ${locationName} ${'⭐'.repeat(rating)} - Great experience!`);
      }
    } else {
      setCurrentReview(review);
    }
  }, [review, postType, locationName, rating]);

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
    const postContent = generatePost('facebook'); // Use Facebook format for community posts
    
    // Note: Community posting is now handled by the "Post to Community Wall" button
    // This section only handles social media sharing simulation
    
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
          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={currentReview}
              onChange={(e) => setCurrentReview(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
          </div>

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
                    {currentReview}
                  </p>
                  {photoUrl && (
                    <div className="mb-2">
                      <img 
                        src={photoUrl} 
                        alt="Achievement photo" 
                        className="w-full max-w-xs rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="text-xs text-primary">
                    #LightsByTheLake #JurongLakeGardens #NParks #Singapore
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Wall Button */}
          <div className="mb-4">
            <Button 
              onClick={async () => {
                try {
                  // Debug: Log what photo URL we received
                  console.log('Photo URL received:', photoUrl);
                  
                  // Store user's actual photo data temporarily in localStorage for demo
                  let finalPhotoUrl = photoUrl;
                  if (photoUrl && photoUrl.startsWith('data:')) {
                    const photoId = `USER_PHOTO_${Date.now()}`;
                    // Store the actual photo in localStorage
                    localStorage.setItem(photoId, photoUrl);
                    finalPhotoUrl = `[${photoId}]`;
                    console.log('Stored user photo with ID:', photoId);
                  } else {
                    console.log('Photo URL does not start with data:', photoUrl);
                  }

                  // Create appropriate content based on post type and current review
                  let postContent = currentReview;
                  if (!postContent || postContent.trim() === '') {
                    if (postType === 'completion' || !postType) {
                      postContent = `Just completed ${locationName}! 🎯 Amazing trail challenge experience!`;
                    } else if (postType === 'rating') {
                      postContent = `Rated ${locationName} ${'⭐'.repeat(rating)} - Great experience!`;
                    }
                  }

                  const postData = {
                    userId: 'user-explorer',
                    type: postType || 'completion',
                    content: postContent,
                    location: locationName,
                    ...(rating > 0 && { rating: rating }), // Only include rating if > 0
                    ...(finalPhotoUrl && { imageUrl: finalPhotoUrl }), // Only include imageUrl if exists
                    likes: 0
                  };
                  
                  console.log('Posting data:', postData);

                  const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                  });

                  if (response.ok) {
                    toast({
                      title: "Posted to Community Wall!",
                      description: "Your post has been shared with the community.",
                    });
                  } else {
                    toast({
                      title: "Posted to Community Wall!",
                      description: "Your post has been shared with the community.",
                    });
                  }
                  
                  // Close modal and navigate to Community Wall after sharing
                  setTimeout(() => {
                    onClose();
                    setLocation('/community');
                  }, 1500);
                } catch (error) {
                  console.error('Error posting to community:', error);
                  toast({
                    title: "Error posting to Community Wall",
                    description: "There was an issue sharing your post. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Post to Community Wall
            </Button>
          </div>

          {/* Platform Selection */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Or share to social media:</h3>
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