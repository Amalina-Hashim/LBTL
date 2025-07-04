import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Camera, Upload, Check, Star, Send, Share2, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CameraCapture from "./CameraCapture";
import SocialShareModal from "./SocialShareModal";
import MediaDisplay from "./MediaDisplay";

interface MediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  duration?: number;
}

interface PinData {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'trail' | 'vendor' | 'facility' | 'event';
  completed: boolean;
  vendorName?: string;
  media?: MediaContent[];
  funFact?: string;
}

interface PinDetailModalProps {
  pin: PinData | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (pinId: string, photoFile: File | null) => void;
  onRate: (pinId: string, rating: number, review: string) => void;
}

export default function PinDetailModal({ pin, isOpen, onClose, onComplete, onRate }: PinDetailModalProps) {
  const [qrScanned, setQrScanned] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial state based on pin completion status
  React.useEffect(() => {
    if (pin && isOpen) {
      setIsCompleted(pin.completed || false);
      setIsEditing(false);
    }
  }, [pin, isOpen]);

  if (!pin) return null;

  const canComplete = pin.type === 'trail' ? qrScanned && photoFile : true;

  const handleQRScan = () => {
    setQrScanned(true);
    toast({
      title: "QR Code Scanned!",
      description: "Great! Now take a photo to complete the challenge.",
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
  };

  const handleCameraPhoto = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setShowCamera(false);
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleComplete = () => {
    if (pin && qrScanned && photoFile) {
      onComplete(pin.id, photoFile);
      setIsCompleted(true);
      setIsEditing(false);
      
      toast({
        title: "Check-in Complete!",
        description: "Your trail challenge has been completed successfully.",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleRateSubmit = () => {
    if (pin && rating > 0) {
      onRate(pin.id, rating, review);
      setShowSocialShare(true);
    }
  };

  const handleSocialShareComplete = () => {
    setShowSocialShare(false);
    handleClose();
  };

  const handleClose = () => {
    setQrScanned(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setRating(0);
    setReview("");
    setShowSocialShare(false);
    setShowCamera(false);
    setIsCompleted(false);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold pr-8">{pin.name}</DialogTitle>
          <p className="text-sm sm:text-base text-gray-600">{pin.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {pin.type === 'trail' && (
            <>
              {/* Multimedia Content for Trail Challenges */}
              {pin.media && pin.media.length > 0 && (
                <MediaDisplay media={pin.media} className="mb-4" />
              )}
              
              {/* Educational Fun Fact */}
              {pin.funFact && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 text-sm mb-1">Did You Know?</h4>
                        <p className="text-amber-700 text-sm">{pin.funFact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isCompleted && !isEditing ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-center">
                      <Check className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-green-500" />
                      <h3 className="font-semibold text-green-800 mb-2">Challenge Completed!</h3>
                      <p className="text-sm text-green-700 mb-4">You've successfully completed this trail challenge.</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button onClick={handleEdit} variant="outline" size="sm">
                          Edit Check-in
                        </Button>
                        <Button 
                          onClick={() => setShowSocialShare(true)} 
                          variant="default" 
                          size="sm"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Achievement
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Scan QR Code to check in</p>
                        <Button
                          onClick={handleQRScan}
                          disabled={qrScanned && !isEditing}
                          className={`w-full text-sm sm:text-base ${qrScanned ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'}`}
                        >
                          {qrScanned ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              QR Code Scanned!
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4 mr-2" />
                              Simulate QR Scan
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <label className="block text-sm font-medium mb-2">Share Your Experience</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                        
                        {!photoPreview ? (
                          <div>
                            <Camera className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm sm:text-base text-gray-600 mb-4">Capture or upload a photo</p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                              <Button
                                onClick={handleCameraCapture}
                                variant="default"
                                size="sm"
                                className="flex-1 sm:flex-none"
                              >
                                <Camera className="w-4 h-4 mr-2" />
                                Take Photo
                              </Button>
                              <Button
                                onClick={handleGallerySelect}
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose from Gallery
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={photoPreview}
                              alt="Captured photo"
                              className="max-w-full h-32 sm:h-40 object-cover rounded-lg mx-auto mb-3"
                            />
                            <p className="text-sm text-green-600 mb-2">Photo captured!</p>
                            <Button
                              onClick={() => {
                                setPhotoFile(null);
                                setPhotoPreview(null);
                              }}
                              variant="outline"
                              size="sm"
                            >
                              Retake Photo
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleComplete}
                          disabled={!canComplete}
                          className="flex-1 sm:flex-none sm:px-6 text-sm sm:text-base"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Update Check-in
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-none sm:px-6 text-sm sm:text-base"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleComplete}
                          disabled={!canComplete}
                          className="flex-1 sm:flex-none sm:px-6 text-sm sm:text-base"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Complete Challenge
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-none sm:px-6 text-sm sm:text-base"
                          onClick={() => setShowSocialShare(true)}
                          disabled={!canComplete}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {pin.type === 'vendor' && (
            <>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <label className="block text-sm font-medium mb-2">Rate This Vendor</label>
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-xl sm:text-2xl ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-5 h-5 sm:w-6 sm:h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave a review (optional)..."
                    className="resize-none text-sm sm:text-base"
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Button
                onClick={handleRateSubmit}
                disabled={rating === 0}
                className="w-full text-sm sm:text-base"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </>
          )}

          {pin.type === 'facility' && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Facility information and amenities available here.</p>
                  <Button onClick={handleClose} className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Got it
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {pin.type === 'event' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="font-semibold text-blue-800 mb-2">Special Event Location</h3>
                  <p className="text-blue-700 mb-4">{pin.description}</p>
                  <div className="bg-blue-100 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 font-medium">🎊 Lights by the Lake Event</p>
                    <p className="text-xs text-blue-600 mt-1">Check event schedule for show times</p>
                  </div>
                  <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Star className="w-4 h-4 mr-2" />
                    Experience This Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
      
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraPhoto}
      />

      <SocialShareModal
        isOpen={showSocialShare}
        onClose={handleSocialShareComplete}
        rating={rating}
        review={review}
        locationName={pin.name}
        userName="Trail Explorer"
        photoUrl={photoPreview || undefined}
        postType={pin.type === 'trail' ? 'completion' : 'rating'}
      />
    </Dialog>
  );
}