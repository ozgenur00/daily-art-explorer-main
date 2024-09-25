import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../../../api/api';
import LikedArtworks from '../../../components/artworks/LikedArtworks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(api);

describe('LikedArtworks Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      artwork: {
        likedArtworks: [
          { artwork_id: 1 },
          { artwork_id: 2 },
        ],
        artwork: {
          1: {
            id: 1,
            title: 'Artwork 1',
            artist: 'Artist 1',
            period: 'Period 1',
            medium: 'Medium 1',
            location: 'Location 1',
            image_url: 'image_url_1',
          },
          2: {
            id: 2,
            title: 'Artwork 2',
            artist: 'Artist 2',
            period: 'Period 2',
            medium: 'Medium 2',
            location: 'Location 2',
            image_url: 'image_url_2',
          },
        },
        status: 'succeeded',
        error: null,
      },
      auth: { token: 'mocked-jwt-token' },
    });

    mock.onGet('/artworks/1').reply(200, {
      id: 1,
      title: 'Artwork 1',
      artist: 'Artist 1',
      period: 'Period 1',
      medium: 'Medium 1',
      location: 'Location 1',
      image_url: 'image_url_1',
    });

    mock.onGet('/artworks/2').reply(200, {
      id: 2,
      title: 'Artwork 2',
      artist: 'Artist 2',
      period: 'Period 2',
      medium: 'Medium 2',
      location: 'Location 2',
      image_url: 'image_url_2',
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test('fetches liked artworks on mount and renders artwork details', async () => {
    render(
      <Provider store={store}>
        <LikedArtworks />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Artwork 1')).toBeInTheDocument();
      expect(screen.getByText('Artwork 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Artist: Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Artist: Artist 2')).toBeInTheDocument();
  });

  test('displays "No liked artworks available" when the list is empty', () => {
    store = mockStore({
      artwork: {
        likedArtworks: [],
        artwork: {},
        status: 'succeeded',
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LikedArtworks />
      </Provider>
    );

    expect(screen.getByText('No liked artworks available.')).toBeInTheDocument();
  });

  test('dispatches unlikeArtwork when "Unlike" button is clicked', async () => {
    render(
      <Provider store={store}>
        <LikedArtworks />
      </Provider>
    );

    await waitFor(() => screen.getByText('Artwork 1'));

    fireEvent.click(screen.getAllByText('Unlike')[0]);

    const actions = store.getActions();

    expect(actions.some(action => action.type === 'artwork/unlikeArtwork/pending')).toBe(true);
  });

  test('displays loading state for individual artworks', () => {
    store = mockStore({
      artwork: {
        likedArtworks: [{ artwork_id: 1 }],
        artwork: {},
        status: 'loading',
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LikedArtworks />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
