// CityMap.js
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const CityMap = () => {
    const mapRef = useRef(null); // Reference to map div container

    const longitude = 20.22513; // Replace with city's longitude
    const latitude = 67.85572; // Replace with city's latitude
    const poiLongitude = 20.22355; // Replace with POI's longitude
    const poiLatitude = 67.856602; // Replace with POI's latitude

    useEffect(() => {
        // Coordinates for the city center and POI (replace with actual values)
        const cityCenter = fromLonLat([longitude, latitude]); // Replace with city's longitude, latitude
        const poiLocation = fromLonLat([poiLongitude, poiLatitude]); // Replace with POI's longitude, latitude

        // Initialize the map
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: cityCenter,
                zoom: 14, // Adjust the zoom level as needed
            }),
        });

        // Create a feature for the point of interest
        const poiFeature = new Feature({
            geometry: new Point(poiLocation),
        });

        // Style the point of interest with an icon
        poiFeature.setStyle(
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Replace with the path to your icon
                    scale: 1, // Adjust the scale as needed
                }),
            })
        );

        // Create a vector layer to display the POI
        const poiLayer = new VectorLayer({
            source: new VectorSource({
                features: [poiFeature],
            }),
        });

        // Add the POI layer to the map
        map.addLayer(poiLayer);

        // Clean up the map when the component unmounts
        return () => {
            map.setTarget(null);
        };
    }, []);

    return (
        <div style={{ position: 'relative', height: '75vh' }}>
            <div id="map" ref={mapRef} className="map-container"
            style={{ width: '100%', height: '100%' }}></div>
            <div
                className="gradient-overlay"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
                }}
            ></div>
        </div>
    );
};

export default CityMap;