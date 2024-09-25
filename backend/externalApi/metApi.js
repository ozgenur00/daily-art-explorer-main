const axios = require('axios');

const MET_API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

/**
 * Fetches a specified number of random artworks from The Metropolitan Museum of Art's public API.
 * 
 * @async
 * @function fetchRandomArtworksFromAPI
 * @param {number} [count=1] - The number of random artworks to fetch. Default is 1.
 * @returns {Promise<Array>} An array of objects containing the data of the fetched artworks.
 * @throws {Error} Throws an error if the artworks cannot be fetched.
 */
async function fetchRandomArtworksFromAPI(count = 1) {
    try {
        // Step 1: Fetch all object IDs from the Met API
        const { data: idsData } = await axios.get(`${MET_API_BASE_URL}/objects`);
        console.log('Total Artworks:', idsData.total);
        const total = idsData.total;
        const objectIDs = idsData.objectIDs;

        const randomArtworks = [];
        const usedIndices = new Set();

        console.log('Requested Count:', count);

        // Step 2: Fetch artworks in batches, avoiding duplicates
        while (randomArtworks.length < count && usedIndices.size < total) {
            // Step 3: Select random artwork IDs
            const randomIndex = Math.floor(Math.random() * total);
            
            if (usedIndices.has(randomIndex)) {
                continue; // Avoid duplicates
            }
            
            usedIndices.add(randomIndex);
            const randomArtworkId = objectIDs[randomIndex];
            console.log('Fetching Artwork ID:', randomArtworkId);

            try {
                // Step 4: Fetch artwork details
                const { data: artworkData } = await axios.get(`${MET_API_BASE_URL}/objects/${randomArtworkId}`);
                
                // Step 5: Only add artworks with valid data
                if (artworkData && artworkData.objectID && artworkData.title) {
                    randomArtworks.push(artworkData);
                } else {
                    console.warn('Invalid Artwork Data:', randomArtworkId);
                }
            } catch (error) {
                console.error(`Error fetching artwork ID ${randomArtworkId}:`, error.message);
            }
        }

        console.log('Fetched Artworks:', randomArtworks.length);
        return randomArtworks;
    } catch (err) {
        console.error('Error fetching artworks from The Metropolitan Museum of Art API', err);
        throw new Error('Could not fetch artworks');
    }
}

module.exports = { fetchRandomArtworksFromAPI };
