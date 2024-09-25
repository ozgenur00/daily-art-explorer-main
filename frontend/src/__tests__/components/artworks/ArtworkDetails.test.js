import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../../../api/api';
import ArtworkDetails from '../../../components/artworks/ArtworkDetails';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(api);

describe('ArtworkDetails Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      artwork: {
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
  });

  afterEach(() => {
    mock.reset();
  });

  test('dispatches fetchArtworkById on mount and renders artwork details', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDetails />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('artwork-title')).toBeInTheDocument();
    });

    expect(screen.getByText('Artist: Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Period: Period 1')).toBeInTheDocument();
    expect(screen.getByText('Medium: Medium 1')).toBeInTheDocument();
    expect(screen.getByText('Location: Location 1')).toBeInTheDocument();
  });

  test('displays spinner when status is loading', () => {
    store = mockStore({
      artwork: {
        artwork: {},
        status: 'loading',
        error: null,
      },
      auth: { token: 'mocked-jwt-token' },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('displays error message when status is failed', () => {
    store = mockStore({
      artwork: {
        artwork: {},
        status: 'failed',
        error: 'Failed to fetch artwork',
      },
      auth: { token: 'mocked-jwt-token' }
    });
  
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDetails />
        </BrowserRouter>
      </Provider>
    );

    screen.debug();
  
    expect(screen.getByText(/Failed to fetch artwork/i)).toBeInTheDocument();
  });
  
  
  

  test('dispatches likeArtwork and saveArtwork when buttons are clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ArtworkDetails />
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
});
