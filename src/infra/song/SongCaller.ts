import type { ApiSong } from "./ApiSong";
import { getFirestore, addDoc, collection } from "@firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";
import { auth } from "../api/firebaseConfig";

export class SongCaller {
  private db = getFirestore();

  async createSong(
    title: string,
    artist: string,
    categoryId: string,
    playlistId: string,
  ): Promise<ApiSong> {
    const userId = auth.currentUser?.uid;
    if (!this.db || !userId) {
      throw new Error("Firestore instance or user ID is undefined!");
    }

    const songData: any = {
      title,
      artist,
      categoryId,
      playlistId,
      userId,
    };

    function cleanObject(obj: any) {
      const cleanObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleanObj[key] = value;
        } else {
          cleanObj[key] = null;
        }
      }
      return cleanObj;
    }

    const songsCollection = collection(this.db, "songs");
    const cleanedSongData = cleanObject(songData);
    const docRef = await addDoc(songsCollection, cleanedSongData);

    return {
      id: docRef.id,
      ...songData,
    };
  }

  async getSongs(playlistId: string): Promise<ApiSong[]> {
    if (!this.db || !playlistId) {
      throw new Error("Firestore instance or playlistId is undefined!");
    }
    try {
      const songsCollection = collection(this.db, "songs");
      const songsQuery = query(
        songsCollection,
        where("playlistId", "==", playlistId),
      );
      const querySnapshot = await getDocs(songsQuery);

      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as ApiSong;
      });
    } catch (error) {
      console.error("Error fetching songs:", error);
      throw error;
    }
  }
}
