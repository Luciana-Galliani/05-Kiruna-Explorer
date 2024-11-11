import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat, transformExtent } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import API from "../API/API.mjs";

const CityMap = ({ isSelectingCoordinates, handleCoordinatesSelected }) => {
    const [allDocuments, setAllDocuments] = useState([]);

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const longitude = 20.22513;
    const latitude = 67.85572;

    // Define bounding coordinates for latitude and longitude
    const MIN_LAT = 67.5;
    const MAX_LAT = 68.17;
    const MIN_LNG = 19.09;
    const MAX_LNG = 21.3;

    const iconMap = {
        "Design Document": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Informative Document": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Prescriptive Document": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Technical Document": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Agreement": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Conflict": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Consultation": "https://openlayers.org/en/latest/examples/data/icon.png",
        "Action": "https://openlayers.org/en/latest/examples/data/icon.png",
        //TODO: Replace these URLs with those of your custom icons
    };

    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                const response = await API.getDocuments();
                setAllDocuments(response.documents);
            } catch (err) {
                throw new Error(err.message);
            }
        };

        fetchAllDocuments();
    }, [allDocuments]);

    useEffect(() => {
        // Transform extent to the map projection
        const extent = transformExtent(
            [MIN_LNG, MIN_LAT, MAX_LNG, MAX_LAT],
            "EPSG:4326",
            "EPSG:3857"
        );
        const cityCenter = fromLonLat([longitude, latitude]);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: cityCenter,
                zoom: 14,
                minZoom: 12,
                maxZoom: 20,
                extent: extent,
            }),
        });

        mapInstanceRef.current = map;

        return () => {
            map.setTarget(null);
        };
        
    }, []);

    useEffect(() => {
        if (!allDocuments || allDocuments.length === 0) return;

        const features = allDocuments
        .filter((doc) => doc.longitude !== null && doc.latitude !== null)
        .map((doc) => {
            const { longitude, latitude } = doc;
            const location = fromLonLat([longitude, latitude]);

            const feature = new Feature({
                geometry: new Point(location),
                documentId: doc.id,
            });

            feature.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: iconMap[doc.type],
                        scale: 1,
                    }),
                })
            );

            return feature;
        });

        const vectorSource = new VectorSource({
            features: features,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const map = mapInstanceRef.current;
        if (map) {
            map.addLayer(vectorLayer);
        }

        return () => {
            if (map) {
                map.removeLayer(vectorLayer); // Clean up on component unmount
            }
        };
    }, [allDocuments]);

    useEffect(() => {
        // Change cursor style based on isSelectingCoordinates
        const targetElement = mapRef.current;
        if (isSelectingCoordinates) {
            targetElement.style.cursor = "pointer";
        } else {
            targetElement.style.cursor = "default";
        }

        const handleMapClick = (event) => {
            if (isSelectingCoordinates) {
                const clickedCoordinate = event.coordinate;
                const [lon, lat] = toLonLat(clickedCoordinate);
                handleCoordinatesSelected(lon, lat);
            }
        };

        const map = mapInstanceRef.current;
        if (!map) return;
        map.on("click", handleMapClick);
        return () => {
            map.un("click", handleMapClick);
        };
    }, [isSelectingCoordinates, handleCoordinatesSelected]);

    return (
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
};

export default CityMap;