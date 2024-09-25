// src/features/artworks/artworkSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
    fetchArtwork,
    fetchArtworkWithImage,
    fetchArtworkById,
    likeArtwork,
    unlikeArtwork,
    saveArtwork,
    unsaveArtwork,
    fetchLikedArtworks,
    fetchSavedArtworks,
    fetchFilteredArtworks,
    fetchAllArtworks,
} from './ArtworkThunks';

const artworkSlice = createSlice({
    name: 'artwork',
    initialState: {
        artwork: {},  
        artworks: [], 
        likedArtworks: [],
        savedArtworks: [],
        currentPage: 1,
        totalPages: 1,
        status: 'idle',
        error: null,
        flashMessage: null,
        artworksLoaded: false, 
    },
    reducers: {
        clearFlashMessage: (state) => {
            state.flashMessage = null;
        },
        resetArtworksState: (state) => {
            state.artworks = [];
            state.artworksLoaded = false;
            state.status = 'idle';
            state.error = null;
        },
        resetArtworkState: (state) => {
            state.artwork = {};
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtwork.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArtwork.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.artwork = action.payload;  // Storing the single artwork object
            })
            .addCase(fetchArtwork.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchArtworkById.fulfilled, (state, action) => {
                state.artwork[action.payload.id] = action.payload;
                state.status = 'succeeded';
              })
            .addCase(fetchLikedArtworks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLikedArtworks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.likedArtworks = action.payload;
            })
            .addCase(fetchLikedArtworks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchSavedArtworks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSavedArtworks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.savedArtworks = action.payload;
            })
            .addCase(fetchSavedArtworks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(likeArtwork.fulfilled, (state, action) => {
                state.likedArtworks.push(action.payload);  
                state.flashMessage = 'Artwork liked!';
            })
            .addCase(saveArtwork.fulfilled, (state, action) => {
                state.savedArtworks.push(action.payload); 
                state.flashMessage = 'Artwork saved!';
            })
            .addCase(likeArtwork.rejected, (state, action) => {
                // Set a custom flash message for already liked artwork
                if (action.payload === 'Artwork already liked') {
                    state.flashMessage = 'You have already liked this artwork.';
                } else {
                    state.flashMessage = 'Failed to like artwork.';
                }
                state.error = action.payload || action.error.message;  // Store the error
            })
            .addCase(saveArtwork.rejected, (state, action) => {
                // Set a custom flash message for already saved artwork
                if (action.payload === 'Artwork already saved') {
                    state.flashMessage = 'You have already saved this artwork.';
                } else {
                    state.flashMessage = 'Failed to save artwork.';
                }
                state.error = action.payload || action.error.message;  // Store the error
            })
            .addCase(fetchFilteredArtworks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilteredArtworks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.artworks = action.payload;
                state.artworksLoaded = true; 
            })
            .addCase(fetchFilteredArtworks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(unlikeArtwork.fulfilled, (state, action) => {
                state.likedArtworks = state.likedArtworks.filter(
                    (artwork) => artwork.artwork_id !== action.payload
                );
                state.flashMessage = 'Artwork unliked!';
            })
            .addCase(unsaveArtwork.fulfilled, (state, action) => {
                state.savedArtworks = state.savedArtworks.filter(
                    (artwork) => artwork.artwork_id !== action.payload
                );
                state.flashMessage = 'Artwork unsaved!';
            })
            .addCase(fetchAllArtworks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllArtworks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.artworks = action.payload.artworks;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchAllArtworks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { clearFlashMessage, resetArtworksState } = artworkSlice.actions;
export default artworkSlice.reducer;
