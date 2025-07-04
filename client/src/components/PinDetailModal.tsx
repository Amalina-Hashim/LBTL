import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Camera, Upload, Trash2, Check, QrCode, Star, Send, Share2 } from "lucide-react";
import { PinData } from "@/data/pinData";
import { useToast } from "@/hooks/use-toast";
import SocialShareModal from "./SocialShareModal";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleQRScan = () => {
    setQrScanned(true);
    toast({
      title: "QR Code Scanned!",
      description: "Location verified successfully",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      // Reset the input first
      fileInputRef.current.value = '';
      // Set capture attribute for camera
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.setAttribute('accept', 'image/*');
      fileInputRef.current.click();
    }
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      // Reset the input first
      fileInputRef.current.value = '';
      // Remove capture attribute for gallery selection
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.setAttribute('accept', 'image/*');
      fileInputRef.current.click();
    }
  };

  const handleComplete = () => {
    if (pin && qrScanned && photoFile) {
      onComplete(pin.id, photoFile);
      handleClose();
    }
  };

  const handleRateSubmit = () => {
    if (pin && rating > 0) {
      onRate(pin.id, rating, review);
      
      // Show social sharing modal after successful rating
      if (review.trim()) {
        setShowSocialShare(true);
      } else {
        handleClose();
      }
    }
  };

  const handleSocialShareClose = () => {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const canComplete = qrScanned && photoFile;

  if (!pin) return null;

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
              {/* QR Code Section */}
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Scan QR Code to check in</p>
                    <Button
                      onClick={handleQRScan}
                      disabled={qrScanned}
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

              {/* Photo Upload Section */}
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
                        <p className="text-xs text-gray-500 mb-3">📱 On mobile: "Take Photo" opens your camera</p>
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
                          alt="Preview"
                          className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
                        />
                        <Button
                          onClick={handleRemovePhoto}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleComplete}
                  disabled={!canComplete}
                  className="flex-1 text-sm sm:text-base"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Check-in
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
              </div>
            </>
          )}

          {pin.type === 'vendor' && (
            <>
              {/* Rating Section */}
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
        </div>
      </DialogContent>
      
      {/* Social Sharing Modal */}
      <SocialShareModal
        isOpen={showSocialShare}
        onClose={handleSocialShareClose}
        rating={pin.type === 'vendor' ? rating : undefined}
        review={pin.type === 'vendor' ? review : `Just completed the ${pin.name} challenge! 🎉`}
        locationName={pin.name}
        userName="Nature Explorer"
        photoUrl={photoPreview || undefined}
        postType={pin.type === 'vendor' ? 'rating' : 'completion'}
      />
    </Dialog>
  );
}
