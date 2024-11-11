import React from 'react';
import CityMap from './Map.jsx';
const HomePage = ({ handleCoordinatesSelected, isSelectingCoordinates }) => {
    return (
        /*<div className="homepage text-center text-white position-relative" style={{
            backgroundImage: 'url("../../This_is_Kiruna.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'
        }}>
            <div className="overlay position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        </div>*/
        <CityMap isSelectingCoordinates={isSelectingCoordinates} handleCoordinatesSelected={handleCoordinatesSelected} />
    );
};

export default HomePage;
