import React from 'react';
import { render, screen } from '@testing-library/react';
import Placeholder from '../../../components/common/Placeholder';

describe('Placeholder Component', () => {
  test('renders the Placeholder component with correct text', () => {
    render(<Placeholder />);

    expect(screen.getByText('Image is not available at the moment')).toBeInTheDocument();
  });
});
