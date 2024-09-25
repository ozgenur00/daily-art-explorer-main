import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '../../../components/common/Spinner';  

describe('Spinner Component', () => {
  
  test('renders the spinner component', () => {
    render(<Spinner />);

    // Check if the spinner is in the document by its test id
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
    
    // Check if the spinner has the correct class for styling
    expect(spinnerElement).toHaveClass('loader');
    
    // Ensure the structure of the loader-inner and loader-line-wrap elements exists
    expect(spinnerElement.querySelector('.loader-inner')).toBeInTheDocument();
    
    // There should be 5 loader-line-wrap elements
    const lineWraps = spinnerElement.querySelectorAll('.loader-line-wrap');
    expect(lineWraps.length).toBe(5);
    
    // Ensure each loader-line-wrap has a loader-line
    lineWraps.forEach((lineWrap) => {
      expect(lineWrap.querySelector('.loader-line')).toBeInTheDocument();
    });
  });
});
