import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, MessageCircle, Share2, User } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { getPosts, trackAnalytics } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  username: string;
  location: string;
  timestamp: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export default function CommunityWallPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
    trackAnalytics('page_view', { page: 'community_wall' });
  }, []);

  const loadPosts = async () => {
    try {
      // Fetch from API endpoint first
      const response = await fetch('/api/posts');
      if (response.ok) {
        const apiPosts = await response.json();
        const formattedPosts = apiPosts.posts.map((post: any) => ({
          id: post.id,
          username: post.userId === 'user-demo' ? 'TrailExplorer' : 
                   post.userId === 'user-alice' ? 'AliceWanders' :
                   post.userId === 'user-bob' ? 'BobAdventures' :
                   post.userId === 'user-carol' ? 'CarolTrails' :
                   post.userId === 'user-david' ? 'DavidEats' :
                   post.userId === 'user-explorer' ? 'Trail Explorer' :
                   post.userId === 'user-test' ? 'Anonymous User' : 'Explorer',
          location: post.location || 'Jurong Lake Gardens',
          timestamp: new Date(post.createdAt).toLocaleDateString(),
          imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          caption: post.content,
          likes: post.likes || 0,
          comments: Math.floor(Math.random() * 5) + 2,
          createdAt: new Date(post.createdAt),
        }));
        setPosts(formattedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } else {
        // Fallback to Firebase if API fails
        const fetchedPosts = await getPosts(20);
        setPosts(fetchedPosts as CommunityPost[]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Set empty posts array instead of sample posts
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const setSamplePosts = () => {
    const samplePosts: CommunityPost[] = [
      {
        id: "1",
        username: "Nature Explorer",
        location: "Chinese Garden",
        timestamp: "2 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        caption: "Amazing lantern display at the Chinese Garden! The reflections on the water are absolutely stunning. #LightsByTheLake #NParks",
        likes: 24,
        comments: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "2",
        username: "Trail Walker",
        location: "Science Park Trail",
        timestamp: "4 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        caption: "The night bazaar is incredible! So many delicious food options. The satay here is the best I've ever had! 🍢✨",
        likes: 18,
        comments: 5,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: "3",
        username: "Garden Enthusiast",
        location: "Japanese Garden",
        timestamp: "6 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        caption: "The Japanese Garden is so peaceful and beautiful. Perfect spot for meditation and reflection. The stone lanterns create such a magical atmosphere! 🏮",
        likes: 32,
        comments: 7,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ];
    setPosts(samplePosts);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
    
    trackAnalytics('post_like', { postId });
    toast({
      title: "Post Liked!",
      description: "Thank you for engaging with the community!",
    });
  };

  const handleShare = (platform: string, postId: string) => {
    trackAnalytics('post_share', { platform, postId });
    toast({
      title: "Share Feature",
      description: `Would open ${platform} sharing dialog`,
    });
  };

  const filteredPosts = selectedLocation === "all" 
    ? posts 
    : posts.filter(post => post.location.toLowerCase().includes(selectedLocation.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/event">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community Wall</h1>
                <p className="text-gray-600">Shared experiences from the event</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="chinese">Chinese Garden</SelectItem>
                  <SelectItem value="japanese">Japanese Garden</SelectItem>
                  <SelectItem value="science">Science Park Trail</SelectItem>
                  <SelectItem value="night">Night Bazaar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <User className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No posts found</h3>
                <p>Be the first to share your experience from this location!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="text-white w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">{post.username}</div>
                        <div className="text-sm text-gray-600">{post.timestamp} • {post.location}</div>
                      </div>
                    </div>
                    
                    <img 
                      src={post.imageUrl} 
                      alt={`Post from ${post.location}`}
                      className="w-full h-64 object-cover rounded-lg mb-4" 
                    />
                    
                    <p className="text-gray-800 mb-4">{post.caption}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-5 h-5 mr-1" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5 mr-1" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleShare('Facebook', post.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <SiFacebook className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleShare('Instagram', post.id)}
                          className="text-pink-600 hover:text-pink-800 transition-colors"
                        >
                          <SiInstagram className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
