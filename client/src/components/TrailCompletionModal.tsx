import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Star, Share2, Camera, Sparkles, Award, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CameraCapture from "./CameraCapture";
import SocialShareModal from "./SocialShareModal";

interface TrailCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: number;
  totalCount: number;
  onCelebrationPost: (message: string, photoFile: File | null) => void;
}

export default function TrailCompletionModal({ 
  isOpen, 
  onClose, 
  completedCount, 
  totalCount,
  onCelebrationPost 
}: TrailCompletionModalProps) {
  const [message, setMessage] = useState(`🎉 Just completed the entire Science Park Trail Challenge at Jurong Lake Gardens! ${completedCount}/${totalCount} challenges conquered! #NearApp #ScienceParkTrail #JurongLakeGardens #TrailChallenge`);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);

  const achievements = [
    { icon: Target, label: "Trail Explorer", description: "Completed all Science Park Trail challenges" },
    { icon: Camera, label: "Memory Maker", description: "Captured moments at every location" },
    { icon: Star, label: "Nature Navigator", description: "Discovered Jurong Lake Gardens" },
  ];

  const handleCameraPhoto = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setShowCamera(false);
  };

  const handleShareToCommunity = () => {
    if (message.trim()) {
      onCelebrationPost(message, photoFile);
      toast({
        title: "Shared to Community!",
        description: "Your trail completion has been posted to the community wall.",
      });
      onClose();
    }
  };

  const handleShareToSocial = () => {
    setShowSocialShare(true);
  };

  const handleSocialShareComplete = () => {
    setShowSocialShare(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">Trail Completed!</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Celebration Card */}
            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-3">🎊</div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Congratulations!</h3>
                <p className="text-gray-700 mb-4">
                  You've successfully completed all <span className="font-semibold text-primary">{totalCount} Science Park Trail challenges</span> at Jurong Lake Gardens!
                </p>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-3xl font-bold text-primary">{completedCount}/{totalCount}</div>
                  <div className="text-sm text-gray-600">Challenges Completed</div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Achievements Unlocked
                </h4>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <achievement.icon className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-medium text-sm text-gray-800">{achievement.label}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photo Section */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Celebration Photo (Optional)</h4>
                
                {photoPreview ? (
                  <div className="relative mb-3">
                    <img src={photoPreview} alt="Celebration" className="w-full h-32 object-cover rounded-lg" />
                    <Button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowCamera(true)}
                    variant="outline"
                    className="w-full mb-3"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Celebration Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Share Message */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Share Your Achievement</h4>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your celebration message..."
                  className="resize-none mb-4"
                  rows={4}
                />
                
                <div className="space-y-2">
                  <Button
                    onClick={handleShareToCommunity}
                    className="w-full"
                    disabled={!message.trim()}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Community Wall
                  </Button>
                  
                  <Button
                    onClick={handleShareToSocial}
                    variant="outline"
                    className="w-full"
                    disabled={!message.trim()}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Share to Social Media
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Close Button */}
            <Button onClick={onClose} variant="outline" className="w-full">
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraPhoto}
      />

      <SocialShareModal
        isOpen={showSocialShare}
        onClose={handleSocialShareComplete}
        locationName="Science Park Trail - Jurong Lake Gardens"
        userName="Trail Explorer"
        review={message}
        photoUrl={photoPreview || undefined}
        postType="completion"
      />
    </>
  );
}