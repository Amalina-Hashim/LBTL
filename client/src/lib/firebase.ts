import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Anonymous authentication
export const signInAnonymouslyUser = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    return null;
  }
};

// User management
export const createOrUpdateUser = async (uid: string, userData: Partial<any>) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { uid, ...userData }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return false;
  }
};

export const getUserData = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Pin completion tracking
export const markPinCompleted = async (uid: string, pinId: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const completedPins = userData.completedPins || [];
      
      if (!completedPins.includes(pinId)) {
        await updateDoc(userRef, {
          completedPins: [...completedPins, pinId]
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error marking pin completed:", error);
    return false;
  }
};

// Photo upload
export const uploadPhoto = async (file: File, path: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo:", error);
    return null;
  }
};

// Community posts
export const createPost = async (postData: any) => {
  try {
    const postsRef = collection(db, "posts");
    await addDoc(postsRef, {
      ...postData,
      createdAt: new Date(),
      likes: 0,
      comments: 0
    });
    return true;
  } catch (error) {
    console.error("Error creating post:", error);
    return false;
  }
};

export const getPosts = async (limitCount: number = 20) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
};

export const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

// Vendor ratings
export const createRating = async (ratingData: any) => {
  try {
    const ratingsRef = collection(db, "ratings");
    await addDoc(ratingsRef, {
      ...ratingData,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error creating rating:", error);
    return false;
  }
};

export const getRatings = async () => {
  try {
    const ratingsRef = collection(db, "ratings");
    const q = query(ratingsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting ratings:", error);
    return [];
  }
};

export const deleteRating = async (ratingId: string) => {
  try {
    await deleteDoc(doc(db, "ratings", ratingId));
    return true;
  } catch (error) {
    console.error("Error deleting rating:", error);
    return false;
  }
};

// Analytics tracking
export const trackAnalytics = async (eventType: string, data?: any) => {
  try {
    const analyticsRef = collection(db, "analytics");
    await addDoc(analyticsRef, {
      eventType,
      data,
      timestamp: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return false;
  }
};
