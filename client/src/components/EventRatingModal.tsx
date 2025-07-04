import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number, review: string) => void;
}

export default function EventRatingModal({ isOpen, onClose, onSubmitRating }: EventRatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose 1-5 stars to rate the event.",
        variant: "destructive",
      });
      return;
    }

    onSubmitRating(rating, review);
    
    // Reset form
    setRating(0);
    setReview("");
    onClose();
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex justify-center mb-2">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <span className="text-xl font-bold text-primary">Rate Lights by the Lake</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Lights by the Lake Event</h3>
              <p className="text-sm text-gray-600">Science Park Trail Experience at Jurong Lake Gardens</p>
            </CardContent>
          </Card>

          {/* Star Rating */}
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-3">How would you rate this event?</h4>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= displayRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {displayRating === 0 && "Select your rating"}
              {displayRating === 1 && "Poor"}
              {displayRating === 2 && "Fair"}
              {displayRating === 3 && "Good"}
              {displayRating === 4 && "Very Good"}
              {displayRating === 5 && "Excellent"}
            </p>
          </div>

          {/* Review Text */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Share your experience (optional)</h4>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others about your experience with the trail challenges, multimedia content, and overall event..."
              className="resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={rating === 0}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Submit Rating & Share to Community
            </Button>
            
            <Button onClick={onClose} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}