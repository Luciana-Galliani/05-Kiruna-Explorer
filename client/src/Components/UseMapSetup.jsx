import { useRef, useEffect } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";

export const useMapSetup = ({ mapRef, isSatelliteView, centerIn }) => {
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const cityCenter = fromLonLat([20.22513, 67.85572]); // Centro di Kiruna

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
            }),
        });

        mapInstanceRef.current = map;

        return () => {
            map.setTarget(null);
        };
    }, [isSatelliteView]);

    useEffect(() => {
        if (!mapInstanceRef.current || !centerIn) return;

        const map = mapInstanceRef.current;
        if (Array.isArray(centerIn) && centerIn.length === 2) {
            const location = fromLonLat(centerIn);
            map.getView().setCenter(location);
        } else if (centerIn?.area) {
            const location = fromLonLat([parseFloat(centerIn.area.centerLon), parseFloat(centerIn.area.centerLat)]);
            map.getView().setCenter(location);

        }
    }, [centerIn]);

    return mapInstanceRef;
};
