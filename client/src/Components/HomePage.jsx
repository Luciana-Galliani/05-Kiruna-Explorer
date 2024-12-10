import React from 'react';
import CityMap from './Map.jsx';
import PropTypes from 'prop-types';

const HomePage = ({ handleCoordinatesSelected, isSatelliteView, handleSatelliteView, handleAreaSelected, centerIn, setCenterIn }) => {
    return (
        <CityMap
            handleCoordinatesSelected={handleCoordinatesSelected}
            isSatelliteView={isSatelliteView}
            handleSatelliteView={handleSatelliteView}
            handleAreaSelected={handleAreaSelected}
            centerIn={centerIn}
        />
    );
};

HomePage.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleSatelliteView: PropTypes.func.isRequired,
    handleAreaSelected: PropTypes.func.isRequired
};

export default HomePage;
