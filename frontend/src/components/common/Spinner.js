import React from 'react';
import '../../styles/common/Spinner.css';


const Spinner = () => {
    return (
            <div className="loader" data-testid="spinner">
              <div className="loader-inner">
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                    <div className="loader-line"></div>
                </div>
            </div>
        </div>
    );
};

export default Spinner;


  