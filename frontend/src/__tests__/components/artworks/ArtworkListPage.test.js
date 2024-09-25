import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ArtworkListPage from '../../../components/artworks/ArtworkListPage';
import { fetchAllArtworks } from '../../../features/artworks/ArtworkThunks'; 


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../features/artworks/ArtworkThunks', () => ({
  fetchAllArtworks: jest.fn(),
}));

describe('ArtworkListPage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      artwork: {
        artworks: [
          { id: 1, title: 'Artwork 1', artist: 'Artist 1' },
          { id: 2, title: 'Artwork 2', artist: 'Artist 2' }
        ],
        status: 'succeeded',
        error: null,
        currentPage: 1,
        totalPages: 2,
      },
    });

    fetchAllArtworks.mockImplementation(() => ({ type: 'artwork/fetchAllArtworks/pending', meta: { arg: { page: 2, pageSize: 21 } }}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the artwork list page and artworks', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkListPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    expect(screen.getByText('Artwork 2')).toBeInTheDocument();
  });

  test('handles pagination and page changes', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkListPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();


    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(fetchAllArtworks).toHaveBeenCalledWith({ page: 2, pageSize: 21 });

      const fetchAction = actions.find(action => action.type === 'artwork/fetchAllArtworks/pending');
      expect(fetchAction).toBeDefined();
      expect(fetchAction.meta.arg.page).toBe(2);
      expect(fetchAction.meta.arg.pageSize).toBe(21);
    });
  });

  test('renders spinner when loading', () => {
    store = mockStore({
      artwork: {
        artworks: [],
        status: 'loading',
        currentPage: 1,
        totalPages: 2,
      },
    });
  
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkListPage />
        </BrowserRouter>
      </Provider>
    );
  
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders error message when fetch fails', () => {
    store = mockStore({
      artwork: {
        artworks: [],
        status: 'failed',
        error: 'Failed to fetch artworks',
        currentPage: 1,
        totalPages: 2,
      },
    });
  
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkListPage />
        </BrowserRouter>
      </Provider>
    );
  
    expect(screen.getByText('Error: Failed to fetch artworks')).toBeInTheDocument();
  });
  
});
