// src/__tests__/components/artworks/ArtworkDisplay.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../../../api/api';
import ArtworkDisplay from '../../../components/artworks/ArtworkDisplay';
import { fetchArtwork, likeArtwork, saveArtwork } from '../../../features/artworks/ArtworkThunks';

jest.mock('react-share', () => ({
  FacebookShareButton: ({ children }) => <div>{children}</div>,
  TwitterShareButton: ({ children }) => <div>{children}</div>,
  LinkedinShareButton: ({ children }) => <div>{children}</div>,
  WhatsappShareButton: ({ children }) => <div>{children}</div>,
  FacebookIcon: () => <div>FacebookIcon</div>,
  TwitterIcon: () => <div>TwitterIcon</div>,
  LinkedinIcon: () => <div>LinkedinIcon</div>,
  WhatsappIcon: () => <div>WhatsappIcon</div>,
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(api);

describe('ArtworkDisplay Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      artwork: {
        artwork: {
          id: 1,
          title: 'Artwork 1',
          artist: 'Artist 1',
          period: 'Period 1',
          medium: 'Medium 1',
          location: 'Location 1',
          image_url: 'image_url_1',
          metUrl: 'https://art.metmuseum.org',
        },
        likedArtworks: [],
        savedArtworks: [], 
        status: 'succeeded',
        error: null,
      },
      auth: { token: 'mocked-jwt-token' },
    });

    mock.onGet('/artworks').reply(200, {
      id: 1,
      title: 'Artwork 1',
      artist: 'Artist 1',
      period: 'Period 1',
      medium: 'Medium 1',
      location: 'Location 1',
      image_url: 'image_url_1',
      metUrl: 'https://art.metmuseum.org',
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test('dispatches fetchArtwork on mount and renders artwork details', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDisplay />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Artist: Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Period: Period 1')).toBeInTheDocument();
    expect(screen.getByText('Medium: Medium 1')).toBeInTheDocument();
    expect(screen.getByText('Location: Location 1')).toBeInTheDocument();
  });

  test('displays multiple spinners when status is loading', () => {
    store = mockStore({
      artwork: {
        artwork: {},
        status: 'loading',
        error: null,
      },
      auth: { token: 'mocked-jwt-token' }
    });
  
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDisplay />
        </BrowserRouter>
      </Provider>
    );
  
    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.length).toBeGreaterThan(0); 
  });
  

  test('displays error message when status is failed', () => {
    store = mockStore({
      artwork: {
        artwork: {},
        status: 'failed',
        error: 'Failed to fetch artwork',
      },
      auth: { token: 'mocked-jwt-token' },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDisplay />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Error: Failed to fetch artwork')).toBeInTheDocument();
  });

  test('dispatches likeArtwork and saveArtwork when buttons are clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDisplay />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText('Artwork 1'));


    fireEvent.click(screen.getByText('Like'));
    fireEvent.click(screen.getByText('Save'));

    const actions = store.getActions();

    expect(actions.some(action => action.type === 'artwork/likeArtwork/pending')).toBe(true);
    expect(actions.some(action => action.type === 'artwork/saveArtwork/pending')).toBe(true);
  });

  test('dispatches fetchArtwork when "Show Another Artwork" button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDisplay />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => screen.getByText('Artwork 1'));

    fireEvent.click(screen.getByText('Show Another Artwork'));

    const actions = store.getActions();

    expect(actions.some(action => action.type === 'artwork/fetchArtwork/pending')).toBe(true);
  });
});
