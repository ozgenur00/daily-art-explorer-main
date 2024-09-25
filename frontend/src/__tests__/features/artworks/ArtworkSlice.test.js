
import artworkReducer, { clearFlashMessage, resetArtworksState } from '../../../features/artworks/ArtworkSlice';
import { fetchArtwork, likeArtwork, saveArtwork, fetchArtworkById, fetchFilteredArtworks } from '../../../features/artworks/ArtworkThunks';


describe('artworkSlice reducers', () => {
    const initialState = {
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
    };

    it('should return the initial state', () => {
        expect(artworkReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle clearFlashMessage', () => {
        const previousState = { ...initialState, flashMessage: 'Some message' };
        expect(artworkReducer(previousState, clearFlashMessage())).toEqual({
            ...initialState,
            flashMessage: null,
        });
    });

    it('should handle resetArtworksState', () => {
        const previousState = { ...initialState, artworks: [{ id: 1, title: 'Mona Lisa' }] };
        expect(artworkReducer(previousState, resetArtworksState())).toEqual({
            ...initialState,
            artworks: [],
            artworksLoaded: false,
            status: 'idle',
            error: null,
        });
    });

    it('should handle fetchArtwork.pending', () => {
        const action = { type: fetchArtwork.pending.type };
        const state = artworkReducer(initialState, action);
        expect(state).toEqual({ ...initialState, status: 'loading' });
    });

    it('should handle fetchArtwork.fulfilled', () => {
        const action = {
            type: fetchArtwork.fulfilled.type,
            payload: [{ id: 1, title: 'Mona Lisa' }], 
        };
        const state = artworkReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            status: 'succeeded',
            artwork: [{ id: 1, title: 'Mona Lisa' }], 
        });
    });
    

    it('should handle fetchArtwork.rejected', () => {
        const action = { type: fetchArtwork.rejected.type, error: { message: 'Failed to fetch' } };
        const state = artworkReducer(initialState, action);
        expect(state).toEqual({
            ...initialState,
            status: 'failed',
            error: 'Failed to fetch',
        });
    });

    it('should handle likeArtwork.fulfilled', () => {
        const action = {
            type: likeArtwork.fulfilled.type,
            payload: { id: 1, title: 'Mona Lisa' },
        };
        const state = artworkReducer(initialState, action);
        expect(state.likedArtworks).toContainEqual({ id: 1, title: 'Mona Lisa' });
        expect(state.flashMessage).toBe('Artwork liked!');
    });

    it('should handle saveArtwork.fulfilled', () => {
        const action = {
            type: saveArtwork.fulfilled.type,
            payload: { id: 1, title: 'Mona Lisa' },
        };
        const state = artworkReducer(initialState, action);
        expect(state.savedArtworks).toContainEqual({ id: 1, title: 'Mona Lisa' });
        expect(state.flashMessage).toBe('Artwork saved!');
    });

    it('should handle fetchArtworkById.fulfilled', () => {
        const action = {
            type: fetchArtworkById.fulfilled.type,
            payload: { id: 1, title: 'Mona Lisa' },
        };
        const state = artworkReducer(initialState, action);
        expect(state.artwork[1]).toEqual({ id: 1, title: 'Mona Lisa' });
    });
    it('should handle likeArtwork.rejected with "already liked" message', () => {
        const action = {
            type: likeArtwork.rejected.type,
            payload: 'Artwork already liked',
        };
        const state = artworkReducer(initialState, action);
        expect(state.flashMessage).toBe('You have already liked this artwork.');
        expect(state.error).toBe('Artwork already liked');
    });
    
    it('should handle likeArtwork.rejected with general failure message', () => {
        const action = {
            type: likeArtwork.rejected.type,
            payload: 'Failed to like artwork',
        };
        const state = artworkReducer(initialState, action);
        expect(state.flashMessage).toBe('Failed to like artwork.');
        expect(state.error).toBe('Failed to like artwork');
    });
    
    it('should handle saveArtwork.rejected with "already saved" message', () => {
        const action = {
            type: saveArtwork.rejected.type,
            payload: 'Artwork already saved',
        };
        const state = artworkReducer(initialState, action);
        expect(state.flashMessage).toBe('You have already saved this artwork.');
        expect(state.error).toBe('Artwork already saved');
    });
    
    it('should handle fetchFilteredArtworks.fulfilled', () => {
        const action = {
            type: fetchFilteredArtworks.fulfilled.type,
            payload: [{ id: 1, title: 'Mona Lisa' }],
        };
        const state = artworkReducer(initialState, action);
        expect(state.artworks).toEqual([{ id: 1, title: 'Mona Lisa' }]);
        expect(state.artworksLoaded).toBe(true);
        expect(state.status).toBe('succeeded');
    });
    
    it('should handle fetchArtwork.rejected and reset status', () => {
        const action = {
            type: fetchArtwork.rejected.type,
            error: { message: 'Failed to fetch' },
        };
        const state = artworkReducer(initialState, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to fetch');
        expect(state.artworksLoaded).toBe(false);
    });
    
});
