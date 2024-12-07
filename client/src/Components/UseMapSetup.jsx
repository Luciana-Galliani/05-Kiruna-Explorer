import { useRef, useEffect } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat, transformExtent } from "ol/proj";

export const useMapSetup = ({ mapRef, isSatelliteView }) => {
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const extent = transformExtent(
            [17.53, 67.21, 23.17, 69.3], // Bounding box for Kiruna
            "EPSG:4326",
            "EPSG:3857"
        );
        const cityCenter = fromLonLat([20.22513, 67.85572]);

        const satelliteLayer = new TileLayer({
            source: new OSM({
                url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            }),
        });

        const standardLayer = new TileLayer({
            source: new OSM(),
        });

        const map = new Map({
            target: mapRef.current,
            layers: [isSatelliteView ? satelliteLayer : standardLayer],
            view: new View({
                center: cityCenter,
                zoom: 14,
                minZoom: 1,
                maxZoom: 20,
                extent: extent,
            }),
        });

        mapInstanceRef.current = map;

        return () => {
            map.setTarget(null);
        };
    }, [isSatelliteView]);

    return mapInstanceRef;
};
