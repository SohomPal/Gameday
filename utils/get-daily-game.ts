import { Game } from '@/types/game'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function getDailyGame(): Promise<Game | null> {
  try {
    // For now, we'll hardcode the document ID. In the future, you might want to
    // implement a system to determine which game to fetch each day.
    const gameDocRef = doc(db, 'games', '1174180')
    const gameDoc = await getDoc(gameDocRef)

    if (gameDoc.exists()) {
      const gameData = gameDoc.data() as Game
      return {
        ...gameData,
        id: gameDoc.id
      }
    } else {
      console.log('No such document!')
      return null
    }
  } catch (error) {
    console.error('Error fetching game:', error)
    return null
  }
}

