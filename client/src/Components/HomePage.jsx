import React from 'react';
import CityMap from './Map.jsx';
import PropTypes from 'prop-types';

const HomePage = ({ handleCoordinatesSelected, isSatelliteView, handleSatelliteView, handleAreaSelected, centerIn, seeOnMap }) => {
    return (
        <CityMap
            handleCoordinatesSelected={handleCoordinatesSelected}
            isSatelliteView={isSatelliteView}
            handleSatelliteView={handleSatelliteView}
            handleAreaSelected={handleAreaSelected}
            centerIn={centerIn}
            seeOnMap={seeOnMap}
        />
    );
};

HomePage.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleSatelliteView: PropTypes.func.isRequired,
    handleAreaSelected: PropTypes.func.isRequired,
    centerIn: PropTypes.any
};

export default HomePage;
