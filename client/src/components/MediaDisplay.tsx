import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { MediaContent } from "@/data/pinData";

interface MediaDisplayProps {
  media: MediaContent[];
  className?: string;
}

export default function MediaDisplay({ media, className = "" }: MediaDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setIsPlaying(false);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    const mediaElement = document.querySelector('.media-element') as HTMLVideoElement | HTMLAudioElement;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const mediaElement = document.querySelector('.media-element') as HTMLVideoElement | HTMLAudioElement;
    if (mediaElement) {
      mediaElement.muted = !isMuted;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Media Content */}
          <div className="relative">
            {currentMedia.type === 'image' && (
              <img
                src={currentMedia.url}
                alt={currentMedia.caption || "Trail media"}
                className="w-full h-64 object-cover"
              />
            )}
            
            {currentMedia.type === 'video' && (
              <div className="relative">
                <video
                  className="media-element w-full h-64 object-cover"
                  src={currentMedia.url}
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Controls */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    onClick={togglePlay}
                    variant="secondary"
                    size="lg"
                    className="rounded-full"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
                
                {/* Mute Button */}
                <Button
                  onClick={toggleMute}
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            )}
            
            {currentMedia.type === 'audio' && (
              <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4">
                    <Volume2 className="w-12 h-12 mx-auto text-primary" />
                  </div>
                  <audio
                    className="media-element w-full max-w-xs"
                    src={currentMedia.url}
                    controls
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              </div>
            )}
            
            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <Button
                  onClick={prevMedia}
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextMedia}
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Media Info */}
          <div className="p-3 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {currentMedia.caption && (
                  <p className="text-sm text-gray-700 mb-1">{currentMedia.caption}</p>
                )}
                {currentMedia.duration && (
                  <p className="text-xs text-gray-500">
                    Duration: {Math.floor(currentMedia.duration / 60)}:{(currentMedia.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <Info className="w-3 h-3 mr-1" />
                {currentIndex + 1}/{media.length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}