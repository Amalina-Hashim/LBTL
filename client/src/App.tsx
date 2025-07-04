import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NavigationHeader from "@/components/NavigationHeader";
import HomePage from "@/pages/HomePage";
import EventMapPage from "@/pages/EventMapPage";
import CommunityWallPage from "@/pages/CommunityWallPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import CompletedChallengesPage from "@/pages/CompletedChallengesPage";
import NotFoundPage from "@/pages/not-found";
import { useEffect } from "react";
import { signInAnonymouslyUser, createOrUpdateUser } from "@/lib/firebase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize Firebase authentication - gracefully handle missing config
    const initAuth = async () => {
      try {
        // Only attempt Firebase auth if config is available
        if (import.meta.env.VITE_FIREBASE_API_KEY) {
          const user = await signInAnonymouslyUser();
          if (user) {
            await createOrUpdateUser(user.uid, {
              completedPins: [],
              totalPhotos: 0,
              totalRatings: 0,
            });
          }
        } else {
          console.log('Firebase config not available - running in demo mode');
        }
      } catch (error) {
        console.log('Running in demo mode without Firebase authentication');
      }
    };

    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <main>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/event" component={EventMapPage} />
            <Route path="/community" component={CommunityWallPage} />
            <Route path="/admin" component={AdminDashboardPage} />
            <Route path="/completed" component={CompletedChallengesPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
