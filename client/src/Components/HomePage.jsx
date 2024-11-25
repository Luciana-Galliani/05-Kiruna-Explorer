import React from 'react';
import CityMap from './Map.jsx';
const HomePage = ({ handleCoordinatesSelected, isSelectingCoordinates, isSatelliteView, handleSatelliteView }) => {
    return (
        <CityMap
            isSelectingCoordinates={isSelectingCoordinates}
            handleCoordinatesSelected={handleCoordinatesSelected}
            isSatelliteView={isSatelliteView}
            handleSatelliteView={handleSatelliteView}
        />
    );
};

export default HomePage;
