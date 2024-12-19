// index.js

require('dotenv').config();
const axios = require('axios');
const puppeteer = require('puppeteer');
const admin = require('firebase-admin');
const Groq = require("groq-sdk");

// -----------------------------
// Configuration and Initialization
// -----------------------------

// Load environment variables
const FIREBASE_KEYFILE = process.env.FIREBASE_APPLICATION_CREDENTIALS;
const GROQ_API_KEY = process.env.GROQ_API_KEY

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(FIREBASE_KEYFILE)),
    });
}
const db = admin.firestore();

// Initialize Puppeteer browser
let browser;

// -----------------------------
// Utility Functions
// -----------------------------

/**
 * Extracts the Steam App ID from the store link.
 * @param {string} link - The Steam store link.
 * @returns {string|null} - The App ID or null if not found.
 */

/**
 * Fetches game details from the Steam API.
 * @param {string} appId - The Steam App ID.
 * @returns {object|null} - The game data or null if failed.
 */
async function fetchGameDetails(appId) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`;
    try {
        const response = await axios.get(url);
        if (response.data[appId] && response.data[appId].success) {
            return response.data[appId].data;
        } else {
            console.error(`Steam API: Failed to fetch data for App ID ${appId}`);
            return null;
        }
    } catch (error) {
        console.error(`Steam API Error for App ID ${appId}:`, error.message);
        return null;
    }
}

async function getFeatures(description){
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    
    async function getGroqChatCompletion() {
        return groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: "Given this description extract exactly 3 features from this, with a title and short one sentence description for each feature. Return the 3 features and their titles in a json format: " + description,
            },
          ],
          model: "llama3-8b-8192",
        });
    }
    
    const chatCompletion = await getGroqChatCompletion();

    const extractJson = (input) => {
        const match = input.match(/```([\s\S]*?)```/);
        return match ? match[1].trim() : null; // Return the JSON part or null if no match
      };
      
    const featuresJSON = extractJson(chatCompletion.choices[0]?.message?.content);
    
    try {
        const features = JSON.parse(featuresJSON); // Parse the JSON if needed
        return features
      } catch (error) {
        console.error("Invalid JSON format:", error);
      }

}

/**
 * Extracts required game data from Steam API response.
 * @param {object} appData - The Steam API response data for a game.
 * @returns {object} - The extracted game data.
 */
async function extractGameData(appData, featureList) {
    //console.log(featureList)
    const features = [];

    // Example: Extracting features from appData's 'genres'
    if (featureList) {
        featureList.forEach((feature) => {
            features.push({
                title: feature.title,
                description: feature.description,
                imageUrl: appData.header_image,
                accentColor: getRandomAccentColor(),
            });
        });
    }

    return {
        id: appData.steam_appid.toString(),
        title: appData.name || '',
        description: appData.short_description || '',
        trailerUrl: appData.movies && appData.movies.length > 0 ? appData.movies[0].mp4['max'] : '',
        purchaseUrl: `https://store.steampowered.com/app/${appData.steam_appid}`,
        features,
        backgroundImage: appData.background || '',
        heroImage: appData.header_image || '',
        expandingImage: appData.header_image || '', // Adjust if different
        price: appData.price_overview ? appData.price_overview.final_formatted : 'Free',
        releaseDate: appData.release_date ? appData.release_date.date : '',
        reviews: [], // To be filled later
        accentColor: getRandomAccentColor(),
    };
}

/**
 * Generates a random accent color from the predefined list.
 * @returns {string} - The selected accent color.
 */
function getRandomAccentColor() {
    const colors = ['yellow', 'red', 'orange', 'purple', 'green', 'blue', 'amber'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Scrapes reviews from GameSpot and Gameranx.
 * @param {string} gameTitle - The title of the game.
 * @returns {Array} - An array of review objects.
 */

function formatTitle(title) {
    return title
        .trim()
        .toLowerCase()
        // Remove all characters that are not letters, numbers, or spaces
        .replace(/[^\w\s-]/g, '')
        // Replace spaces and underscores with dashes
        .replace(/[\s_]+/g, '-')
        // Remove multiple consecutive dashes
        .replace(/-+/g, '-')
        // Remove leading and trailing dashes
        .replace(/^-|-$/g, '');
}

async function scrapeReviews(gameTitle) {
    const reviews = [];
    try {
        const page = await browser.newPage();

        const formattedTitle = formatTitle(gameTitle);

        // --------------------
        // Scrape GameSpot Reviews
        // --------------------
        const gamespotSearchUrl = `https://www.gamespot.com/games/${formattedTitle}/reviews/`;
        await page.goto(gamespotSearchUrl, { waitUntil: 'networkidle2' });

        // Wait for search results to load
        // Wait for the review container to load
        await page.waitForSelector('div.editorial.river', { timeout: 30000 });

        // Extract the review text and rating
        const gameSpotReview = await page.evaluate(() => {
            // Select the review container
            const reviewContainer = document.querySelector('div.editorial.river');
            console.log(reviewContainer)
            if (!reviewContainer) {
                return { source: 'GameSpot', review: null, rating: null };
            }

            // Extract the review text
            const mediaBody = reviewContainer.querySelector('.media-body');
            const reviewTextElement = mediaBody ? mediaBody.querySelector('.media-deck') : null;
            const review = reviewTextElement ? reviewTextElement.innerText.trim() : null;


            // Extract the rating
            const ratingElement = reviewContainer.querySelector('.media-well--review-score');
            const rating = (ratingElement ? ratingElement.innerText.trim() : "0") + "/10";
            

            return { source: 'GameSpot', quote: review, rating };
        });

        reviews.push(await gameSpotReview);

        // --------------------
        // Scrape IGN Reviews
        // --------------------
        const IGNSearchUrl = `https://www.ign.com/articles/${formattedTitle}-review`;
        await page.goto(IGNSearchUrl, { waitUntil: 'networkidle2' });

        // Wait for review contnet to load
        await page.waitForSelector('div[data-cy="review-content"]', { timeout: 10000 });
        
        // Extract the review
        const ignReview = await page.evaluate(() => {
            // Extract the review text
            const reviewContent = document.querySelector('div[data-cy="review-content"]');
            const review = reviewContent ? reviewContent.innerText.trim() : null;

            // Extract the rating
            const ratingElement = document.querySelector('figure[data-cy="review-score"] figcaption');
            const rating = (ratingElement ? ratingElement.innerText.trim() : '0') + '/10';

            // Extract the review quote
            const reviewQuoteElement = document.querySelector('div[data-cy="article-subtitle"]');
            const reviewQuote = reviewQuoteElement ? reviewQuoteElement.innerText.trim() : null;

            return {  source: 'IGN', quote: reviewQuote, rating  };
        });

        reviews.push(await ignReview);
        await page.close();

    } catch (error) {
        console.error(`Error scraping reviews for ${gameTitle}:`, error.message);
    }

    return reviews;
}


/**
 * Creates a Firebase document for a game.
 * @param {object} gameData - The game data adhering to the Game interface.
 */
async function createFirebaseDocument(gameData) {
    try {
        const gameRef = db.collection('games').doc(gameData.id);
        await gameRef.set(gameData);
        console.log(`Firebase: Document created for ${gameData.title}`);
    } catch (error) {
        console.error(`Firebase Error for ${gameData.title}:`, error.message);
    }
}

// -----------------------------
// Main Processing Function
// -----------------------------

export async function addNewGame(appId){
    try {
        // Initialize Puppeteer
        browser = await puppeteer.launch({ headless: true });

        try {
            // Fetch game details from Steam API
            const appData = await fetchGameDetails(appId);
            if (!appData) {
                console.error(`No data found for App ID ${appId}`);
                return;
            }

            const features = await getFeatures(appData.about_the_game)

            // Extract necessary game data
            const gameData = await extractGameData(appData, features);

            // Scrape reviews
            gameData.reviews = await scrapeReviews(gameData.title);

            // Extract screenshot URLs from Steam data
            let screenshotUrls = [];
            if (appData.screenshots && appData.screenshots.length > 0) {
                // Assuming each screenshot has a 'path_full' property
                screenshotUrls = appData.screenshots.map(screenshot => screenshot.path_full);
            } else if (appData.movies && appData.movies.length > 0) {
                // As a fallback, use images from movies
                screenshotUrls = appData.movies.flatMap(movie => movie.images.map(img => img.path_full));
            }

            // Handle media uploads
            // const mediaUrls = await handleMediaUploads(appId, gameData, gameData.trailerUrl, screenshotUrls);
            // gameData.trailerUrl = mediaUrls.trailerUrl || gameData.trailerUrl;

            // Assign uploaded screenshot URLs to features if applicable
            gameData.features.forEach((feature, index) => {
                feature.imageUrl = screenshotUrls[index]
                // if (mediaUrls.screenshots[index]) {
                //     feature.imageUrl = mediaUrls.screenshots[index];
                // }
            });

            // Create Firebase document
            await createFirebaseDocument(gameData);

            console.log(`Processed game: ${game.title}`);

            // Rate limiting: wait for 2 seconds before processing the next game
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (gameError) {
            console.error(`Error processing ${game.title}:`, gameError.message);
        }
        console.log(`\nGame with ID ${appId} has been processed.`);
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export async function fetchTop100SteamGames() {
    const url = 'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/';
    try {
        const response = await axios.get(url);
        if (response.data && response.data.response && response.data.response.ranks) {
            // Extract the top 100 app IDs
            const top100AppIds = response.data.response.ranks
                .slice(0, 100)
                .map(game => game.appid.toString());
            return top100AppIds;
        } else {
            console.error('Steam API: Failed to fetch top games data');
            return [];
        }
    } catch (error) {
        console.error('Steam API Error:', error.message);
        return [];
    }
}

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, exit the process
    // process.exit(1);
});
