import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../../components/common/NotFound';

describe('NotFound Component', () => {
  test('renders the NotFound component with correct text and link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();

    expect(screen.getByText("Oops! The page you're looking for doesn't exist.")).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /take me back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
