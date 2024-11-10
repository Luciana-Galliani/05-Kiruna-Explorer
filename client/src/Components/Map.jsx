import React, { useEffect, useRef } from "react";
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

const CityMap = ({ isSelectingCoordinates, handleCoordinatesSelected, allDocuments }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const longitude = 20.22513;
    const latitude = 67.85572;
    /*const poiLongitude = 20.22355;
    const poiLatitude = 67.856602; */

    // Define bounding coordinates for latitude and longitude
    const MIN_LAT = 67.5;
    const MAX_LAT = 68.17;
    const MIN_LNG = 19.09;
    const MAX_LNG = 21.3;

    useEffect(() => {
        // Transform extent to the map projection
        const extent = transformExtent(
            [MIN_LNG, MIN_LAT, MAX_LNG, MAX_LAT],
            "EPSG:4326",
            "EPSG:3857"
        );
        const cityCenter = fromLonLat([longitude, latitude]);
       // const poiLocation = fromLonLat([poiLongitude, poiLatitude]);

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

        /*const poiFeature = new Feature({
            geometry: new Point(poiLocation),
        });

        poiFeature.setStyle(
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: "https://openlayers.org/en/latest/examples/data/icon.png",
                    scale: 1,
                }),
            })
        );

        const poiLayer = new VectorLayer({
            source: new VectorSource({
                features: [poiFeature],
            }),
        });

        map.addLayer(poiLayer);
        mapInstanceRef.current = map;

        return () => {
            map.setTarget(null);
        }; */
    }, []);

    useEffect(() => {
        if (!allDocuments || allDocuments.length === 0) return;

        const features = allDocuments.map((doc) => {
            const { longitude, latitude } = doc;
            const location = fromLonLat([longitude, latitude]);

            const feature = new Feature({
                geometry: new Point(location),
                documentId: doc.id, // Optional: for later reference
            });

            feature.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: "https://openlayers.org/en/latest/examples/data/icon.png", // Change if needed
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