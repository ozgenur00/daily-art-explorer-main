import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArtworkCard from '../../../components/artworks/ArtworkCard';
import { likeArtwork, unlikeArtwork, saveArtwork, unsaveArtwork } from '../../../features/artworks/ArtworkThunks';
import Placeholder from '../../../components/common/Placeholder';

// Mock the necessary hooks and functions
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../features/artworks/ArtworkThunks', () => ({
  likeArtwork: jest.fn(),
  unlikeArtwork: jest.fn(),
  saveArtwork: jest.fn(),
  unsaveArtwork: jest.fn(),
}));

jest.mock('../../../components/common/Placeholder', () => () => <div data-testid="placeholder-component">Placeholder</div>);

describe('ArtworkCard', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockUseSelector = jest.fn();

  const mockArtwork = {
    id: 1,
    title: 'Mona Lisa',
    artist: 'Leonardo da Vinci',
    period: 'Renaissance',
    medium: 'Oil on panel',
    image_url: 'https://example.com/monalisa.jpg',
  };

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'likedArtworksSelector') {
        return [{ artwork_id: 2 }]; // Set to not liked
      }
      if (selector.name === 'savedArtworksSelector') {
        return [{ artwork_id: 2 }]; // Set to not saved
      }
      return [];
    });
    jest.clearAllMocks();
  });

  test('renders correctly with artwork data', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    expect(screen.getByText('Mona Lisa')).toBeInTheDocument();
    expect(screen.getByText('Artist: Leonardo da Vinci')).toBeInTheDocument();
    expect(screen.getByText('Period: Renaissance')).toBeInTheDocument();
    expect(screen.getByText('Medium: Oil on panel')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Mona Lisa/i })).toHaveAttribute('src', mockArtwork.image_url);
  });

  test('renders Placeholder when image URL is invalid', () => {
    const brokenArtwork = { ...mockArtwork, image_url: null };

    render(<ArtworkCard artwork={brokenArtwork} />);

    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });

  test('dispatches likeArtwork when Like button is clicked', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    const likeButton = screen.getByText('Like');
    fireEvent.click(likeButton);

    expect(mockDispatch).toHaveBeenCalledWith(likeArtwork(mockArtwork.id));
  });

  test('dispatches unlikeArtwork when Unlike button is clicked', () => {
    useSelector.mockReturnValue([{ artwork_id: mockArtwork.id }]); // Mock as liked

    render(<ArtworkCard artwork={mockArtwork} />);

    const unlikeButton = screen.getByText('Unlike');
    fireEvent.click(unlikeButton);

    expect(mockDispatch).toHaveBeenCalledWith(unlikeArtwork(mockArtwork.id));
  });

  test('dispatches saveArtwork when Save button is clicked', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledWith(saveArtwork(mockArtwork.id));
  });

  test('dispatches unsaveArtwork when Unsave button is clicked', () => {
    useSelector.mockReturnValue([{ artwork_id: mockArtwork.id }]); // Mock as saved

    render(<ArtworkCard artwork={mockArtwork} />);

    const unsaveButton = screen.getByText('Unsave');
    fireEvent.click(unsaveButton);

    expect(mockDispatch).toHaveBeenCalledWith(unsaveArtwork(mockArtwork.id));
  });

  test('navigates to the artwork detail page when View More button is clicked', () => {
    render(<ArtworkCard artwork={mockArtwork} />);

    const viewMoreButton = screen.getByText('View More');
    fireEvent.click(viewMoreButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/artwork/${mockArtwork.id}`);
  });
});
