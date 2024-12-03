import React from 'react';
import CityMap from './Map.jsx';
import PropTypes from 'prop-types';

const HomePage = ({ handleCoordinatesSelected, isSatelliteView, handleSatelliteView, handleAreaSelected }) => {
    return (
        <CityMap
            handleCoordinatesSelected={handleCoordinatesSelected}
            isSatelliteView={isSatelliteView}
            handleSatelliteView={handleSatelliteView}
            handleAreaSelected={handleAreaSelected}
        />
    );
};

HomePage.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleSatelliteView: PropTypes.func.isRequired,
};

export default HomePage;
