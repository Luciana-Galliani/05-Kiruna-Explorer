import React from 'react';
import CityMap from './Map.jsx';
const HomePage = ({ handleCoordinatesSelected, isSelectingCoordinates, allDocuments, setAllDocuments, isSatelliteView, handleSatelliteView, isLoggedIn }) => {
    return (
        <CityMap
            isSelectingCoordinates={isSelectingCoordinates}
            handleCoordinatesSelected={handleCoordinatesSelected}
            allDocuments={allDocuments}
            setAllDocuments={setAllDocuments}
            isSatelliteView={isSatelliteView}
            handleSatelliteView={handleSatelliteView}
            isLoggedIn={isLoggedIn}
        />
    );
};

export default HomePage;
