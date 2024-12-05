import { useEffect, useRef, useState } from "react";
import { Draw } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Style, Stroke } from "ol/style";
import { transform } from "ol/proj";

export const useAreaDrawing = ({ mapInstanceRef, isSelectingArea, setAreaGeoJSON, handleAreaSelected }) => {
    const drawInteractionRef = useRef(null);
    const [drawnArea, setDrawnArea] = useState(null);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !isSelectingArea) return;

        const drawSource = new VectorSource();
        const drawLayer = new VectorLayer({
            source: drawSource,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(0, 0, 255, 0.5)",
                    width: 2,
                }),
            }),
        });

        map.addLayer(drawLayer);

        const drawInteraction = new Draw({
            source: drawSource,
            type: "Polygon",
        });

        drawInteraction.on("drawend", (event) => {
            const feature = event.feature;
            const geojsonFormat = new GeoJSON();

            const drawnGeoJSON = geojsonFormat.writeFeatureObject(feature, {
                featureProjection: "EPSG:3857",
                dataProjection: "EPSG:4326",
            });

            setAreaGeoJSON(drawnGeoJSON);

            const coordinates = feature.getGeometry().getCoordinates()[0];
            const coordsIn4326 = coordinates.map((coord) =>
                transform(coord, "EPSG:3857", "EPSG:4326")
            );

            setDrawnArea(coordsIn4326);
            handleAreaSelected(coordsIn4326);

            map.removeInteraction(drawInteraction);
            map.removeLayer(drawLayer);
        });

        map.addInteraction(drawInteraction);
        drawInteractionRef.current = drawInteraction;

        return () => {
            if (drawInteractionRef.current) {
                map.removeInteraction(drawInteractionRef.current);
            }
            map.removeLayer(drawLayer);
        };
    }, [isSelectingArea, setAreaGeoJSON, handleAreaSelected]);

    return drawnArea;
};
