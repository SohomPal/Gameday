import { Game } from '@/types/game'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs, addDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import {fetchTop100SteamGames, addNewGame} from './upload-new-game'

const RECENT_GAMES_LIMIT = 100;

async function getRecentlyUsedGames(): Promise<Set<string>> {
  const recentGamesRef = collection(db, 'recentGames');
  const recentGamesQuery = query(recentGamesRef, orderBy('timestamp', 'desc'), limit(RECENT_GAMES_LIMIT));
  const recentGamesDocs = await getDocs(recentGamesQuery);
  
  return new Set(recentGamesDocs.docs.map(doc => doc.data().appId));
}

async function addToRecentlyUsedGames(appId: string): Promise<void> {
  const recentGamesRef = collection(db, 'recentGames');
  await addDoc(recentGamesRef, {
    appId,
    timestamp: new Date()
  });

  // Remove oldest entry if we've exceeded the limit
  const recentGamesQuery = query(recentGamesRef, orderBy('timestamp', 'asc'));
  const recentGamesDocs = await getDocs(recentGamesQuery);
  if (recentGamesDocs.size > RECENT_GAMES_LIMIT) {
    const oldestDoc = recentGamesDocs.docs[0];
    await deleteDoc(oldestDoc.ref);
  }
}

async function shouldSelectNewGame(): Promise<boolean> {
  const currentGameRef = doc(db, 'currentGame', 'latest');
  const currentGameDoc = await getDoc(currentGameRef);

  if (!currentGameDoc.exists()) {
    return true;
  }

  const lastUpdated = currentGameDoc.data().timestamp.toDate();
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  return now.getTime() - lastUpdated.getTime() >= oneDayInMs;
}

export async function getDailyGame(): Promise<Game | null> {
  const currentGameRef = doc(db, 'currentGame', 'latest');
  const currentGameDoc = await getDoc(currentGameRef);

  if (currentGameDoc.exists() && !(await shouldSelectNewGame())) {
    return currentGameDoc.data().game as Game;
  }

  const topGames = await fetchTop100SteamGames();
  const recentlyUsedGames = await getRecentlyUsedGames();

  for (const appId of topGames) {
    if (recentlyUsedGames.has(appId)) {
      continue; // Skip this game if it's been used recently
    }

    const gameDoc = await getDoc(doc(db, 'games', appId));
    let game: Game;

    if (gameDoc.exists()) {
      game = gameDoc.data() as Game;
    } else {
      await addNewGame(appId);
      const newGameDoc = await getDoc(doc(db, 'games', appId));
      game = newGameDoc.data() as Game;
    }

    await addToRecentlyUsedGames(appId);
    await setDoc(currentGameRef, {
      game: game,
      timestamp: Timestamp.now()
    });

    return game;
  }

  return null;
}