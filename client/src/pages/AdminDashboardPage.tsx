import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Users, QrCode, Camera, Download, Trash2, Star } from "lucide-react";
import { getPosts, getRatings, deletePost, deleteRating, trackAnalytics } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AdminPost {
  id: string;
  username: string;
  location: string;
  createdAt: Date;
  imageUrl: string;
  caption: string;
}

interface AdminRating {
  id: string;
  vendorName: string;
  rating: number;
  review: string;
  createdAt: Date;
}

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [ratings, setRatings] = useState<AdminRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    pageViews: 2341,
    activeUsers: 1247,
    qrScans: 3892,
    photoUploads: 856
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    trackAnalytics('page_view', { page: 'admin_dashboard' });
  }, []);

  const loadData = async () => {
    try {
      const [postsData, ratingsData] = await Promise.all([
        getPosts(50),
        getRatings()
      ]);
      
      setPosts(postsData as AdminPost[]);
      setRatings(ratingsData as AdminRating[]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // For demo purposes, show sample data when Firebase is not configured
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const samplePosts: AdminPost[] = [
      {
        id: "1",
        username: "Nature Explorer",
        location: "Chinese Garden",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        caption: "Amazing lantern display!"
      },
      {
        id: "2",
        username: "Trail Walker",
        location: "Science Park Trail",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        caption: "Night bazaar food is incredible!"
      }
    ];

    const sampleRatings: AdminRating[] = [
      {
        id: "1",
        vendorName: "Satay King",
        rating: 5,
        review: "Best satay I've ever had! Great service too.",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: "2",
        vendorName: "Laksa Paradise",
        rating: 4,
        review: "Good laksa but a bit pricey.",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];

    setPosts(samplePosts);
    setRatings(sampleRatings);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Post Deleted",
        description: "The post has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    try {
      await deleteRating(ratingId);
      setRatings(ratings.filter(rating => rating.id !== ratingId));
      toast({
        title: "Rating Deleted",
        description: "The rating has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Type', 'ID', 'Username/Vendor', 'Location', 'Rating', 'Content', 'Created At'],
      ...posts.map(post => [
        'Post',
        post.id,
        post.username,
        post.location,
        '',
        post.caption,
        post.createdAt.toISOString()
      ]),
      ...ratings.map(rating => [
        'Rating',
        rating.id,
        rating.vendorName,
        '',
        rating.rating.toString(),
        rating.review,
        rating.createdAt.toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lights-by-the-lake-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackAnalytics('csv_export', { recordCount: posts.length + ratings.length });
    toast({
      title: "Export Complete",
      description: "Data has been exported to CSV file.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage content and view analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleExportCSV} className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Eye className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.pageViews}</div>
                  <div className="text-sm text-gray-600">Page Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <QrCode className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.qrScans}</div>
                  <div className="text-sm text-gray-600">QR Scans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Camera className="text-white w-6 h-6" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{analytics.photoUploads}</div>
                  <div className="text-sm text-gray-600">Photos Uploaded</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Community Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Community Posts</CardTitle>
              <p className="text-gray-600">Moderate user-generated content</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-4" />
                    <p>No posts to moderate</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img 
                          src={post.imageUrl} 
                          alt="Post thumbnail"
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium">{post.username}</div>
                          <div className="text-sm text-gray-600">{post.location}</div>
                          <div className="text-xs text-gray-500">
                            {post.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Ratings</CardTitle>
              <p className="text-gray-600">Monitor and manage vendor reviews</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {ratings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4" />
                    <p>No ratings to moderate</p>
                  </div>
                ) : (
                  ratings.map((rating) => (
                    <div key={rating.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{rating.vendorName}</div>
                        <div className="flex items-center mb-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < rating.rating ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{rating.rating}/5</span>
                        </div>
                        {rating.review && (
                          <div className="text-sm text-gray-600 truncate">{rating.review}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          {rating.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteRating(rating.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
