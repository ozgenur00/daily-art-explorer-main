import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import FlashMessage from '../../../components/layout/FlashMessage';
import { clearFlashMessage } from '../../../features/artworks/ArtworkSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../features/artworks/ArtworkSlice', () => ({
  clearFlashMessage: jest.fn(),
}));

describe('FlashMessage Component', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('renders the flash message and clears it after timeout', () => {
    useSelector.mockReturnValue('Test flash message');

    render(<FlashMessage />);

    expect(screen.getByText('Test flash message')).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    expect(dispatch).toHaveBeenCalledWith(clearFlashMessage());
  });

  test('does not render flash message when there is no message', () => {
    useSelector.mockReturnValue(null);

    render(<FlashMessage />);

    expect(screen.queryByText('Test flash message')).not.toBeInTheDocument();
  });
});
