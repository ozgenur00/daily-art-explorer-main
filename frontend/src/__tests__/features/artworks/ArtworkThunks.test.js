import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../../../api/api'; 
import {
    fetchArtwork,
    likeArtwork,
    fetchArtworkById,
    saveArtwork
} from '../../../features/artworks/ArtworkThunks';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(api);

describe('artworkThunks', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { token: 'mocked-jwt-token' }, 
            artwork: { artworks: [] } 
        });
    });

    afterEach(() => {
        mock.reset(); 
    });

    test('dispatches fulfilled action when fetching artwork is successful', async () => {
        const mockResponse = [{ id: 1, title: 'Test Artwork' }];

        mock.onPost('/artworks/fetch').reply(200, mockResponse);

        const result = await store.dispatch(fetchArtwork());

        const actions = store.getActions();
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('artwork/fetchArtwork/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });


test('dispatches rejected action when fetching artwork fails', async () => {
    const mockError = { message: 'Failed to fetch artwork' };

    mock.onPost('/artworks/fetch').reply(400, mockError);

    const result = await store.dispatch(fetchArtwork());

    const actions = store.getActions();
    console.log('Actions dispatched:', actions);

    expect(result.type).toBe('artwork/fetchArtwork/rejected');

    expect(result.error.message).toBe('Rejected');
});


    // Test for likeArtwork thunk
    test('dispatches fulfilled action when liking artwork is successful', async () => {
        const artworkId = 1;
        const mockResponse = { success: true };

        mock.onPost('/likes').reply(200, mockResponse);

        const result = await store.dispatch(likeArtwork(artworkId));

        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('artwork/likeArtwork/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });

    // Test for likeArtwork thunk failure
    test('dispatches rejected action when liking artwork fails', async () => {
        const artworkId = 1;
        const mockError = { message: 'Failed to like artwork' };

       
        mock.onPost('/likes').reply(400, mockError);

        const result = await store.dispatch(likeArtwork(artworkId));

        const actions = store.getActions();
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('artwork/likeArtwork/rejected');
        expect(result.payload).toBe(mockError.message);
    });

    // Test for fetchArtworkById thunk
    test('dispatches fulfilled action when fetching artwork by ID is successful', async () => {
        const artworkId = 1;
        const mockResponse = { id: 1, title: 'Test Artwork' };

       
        mock.onGet(`/artworks/${artworkId}`).reply(200, mockResponse);

        const result = await store.dispatch(fetchArtworkById(artworkId));

        const actions = store.getActions();
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('artwork/fetchArtworkById/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });

    // Test for saveArtwork thunk
    test('dispatches fulfilled action when saving artwork is successful', async () => {
        const artworkId = 1;
        const mockResponse = { success: true };

       
        mock.onPost('/saved_artworks').reply(200, mockResponse);

        const result = await store.dispatch(saveArtwork(artworkId));

        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('artwork/saveArtwork/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });
});
