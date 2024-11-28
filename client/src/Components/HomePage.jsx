import React from 'react';
import CityMap from './Map.jsx';
import PropTypes from 'prop-types';

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

HomePage.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSelectingCoordinates: PropTypes.bool.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleSatelliteView: PropTypes.func.isRequired
};

export default HomePage;
