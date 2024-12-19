import { Game } from '@/types/game'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import {fetchTop20SteamGames, addNewGame} from './upload-new-game'

export async function getDailyGame(): Promise<Game | null> {
  const topGames = await fetchTop20SteamGames();

  for (const appId of topGames) {
    const gameDocRef = doc(db, 'games', appId);
    const gameDoc = await getDoc(gameDocRef);

    if (gameDoc.exists()) {
      return gameDoc.data() as Game;
    } else {
      let newGame = await addNewGame(appId);
      const newGameDoc = await getDoc(doc(db, 'games', appId))
      return newGameDoc.data() as Game;
    }
  }
  return null
}


