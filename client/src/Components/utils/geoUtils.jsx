import { boundingExtent } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Stroke, Icon } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { useRef } from 'react';

export default function getRandomPointNearAreaCenter(area) {
    const centerLat = parseFloat(area.centerLat);
    const centerLon = parseFloat(area.centerLon);
    const geojson = area.geojson;

    // Calculate extent of the area in geographic coordinates
    const geometryExtent = boundingExtent(geojson.coordinates[0]); // Assumes Polygon or MultiPolygon
    const [minX, minY, maxX, maxY] = geometryExtent.map((coord) => toLonLat([coord])[0]);

    // Calculate the maximum offsets (10% of the extent size)
    const MIN_OFFSET = 0.001; // Minimum offset for small areas
    const latOffsetRange = Math.max((maxY - minY) * 0.1, MIN_OFFSET);
    const lonOffsetRange = Math.max((maxX - minX) * 0.1, MIN_OFFSET);

    // Generate random offsets
    const randomLatOffset = (Math.random() - 0.5) * 2 * latOffsetRange;
    const randomLonOffset = (Math.random() - 0.5) * 2 * lonOffsetRange;

    // Calculate the random point near the center
    const randomLat = centerLat + randomLatOffset;
    const randomLon = centerLon + randomLonOffset;

    return [randomLon, randomLat];
}

export const createDocumentLayer = (allDocuments, iconMap) => {
    const features = allDocuments.map((doc) => {
        let location;
        if (doc.longitude !== null && doc.latitude !== null) {
            location = fromLonLat([doc.longitude, doc.latitude]);
        } else if (doc.area) {
            if (doc?.area?.centerLat && doc?.area?.centerLon) {
                location = fromLonLat(getRandomPointNearAreaCenter(doc.area));
            }
        }

        if (!location) return null; // Skip if no valid coordinates

        const feature = new Feature({
            geometry: new Point(location),
            documentId: doc.id,
            documentTitle: doc.title,
        });

        const img = new Image();
        img.src = iconMap[doc.type];
        img.onload = () => {
            const initialStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    img: img,
                    scale: 0.5,
                    imgSize: [img.width, img.height],
                    color: doc.stakeholders?.[0]?.color || "purple",
                }),
            });
            feature.setStyle(initialStyle);
            feature.initialStyle = initialStyle;
        };

        return feature;
    }).filter((feature) => feature !== null);

    const vectorSource = new VectorSource({ features });
    return new VectorLayer({
        name: "documentLayer",
        source: vectorSource,
    });
};

export function handleMapPointerMove({
    mapInstanceRef,
    hoveredFeatureRef,
    isSelectingCoordinates,
    allDocuments,
}) {
    const map = mapInstanceRef.current;
    const hoverSource = new VectorSource();
    const hoverLayer = new VectorLayer({
        source: hoverSource,
        style: new Style({
            stroke: new Stroke({
                color: "rgba(255, 165, 0, 0.8)", // Colore per l'effetto hover
                width: 3,
            }),
        }),
    });

    map.addLayer(hoverLayer);

    const handlePointerMove = (event) => {
        // Reset hover layer
        hoverSource.clear();
        if (isSelectingCoordinates) {
            map.getTargetElement().style.cursor = "pointer";
        } else {
            const hit = map.hasFeatureAtPixel(event.pixel);
            map.getTargetElement().style.cursor = hit ? "pointer" : "";

            // Se si passa sopra una feature
            const featureAtPixel = map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                if (layer?.get("name") === "documentLayer") return feature;
            });

            if (featureAtPixel) {
                if (hoveredFeatureRef.current !== featureAtPixel) {
                    if (hoveredFeatureRef.current) {
                        hoveredFeatureRef.current.setStyle(
                            hoveredFeatureRef.current.initialStyle
                        );
                    }
                    const currentFeatureStyle = featureAtPixel.getStyle();
                    const icon = currentFeatureStyle.getImage();
                    const img = new Image();
                    img.src = icon.getSrc();
                    img.onload = () => {
                        featureAtPixel.setStyle(
                            new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    img: img,
                                    scale: 0.55,
                                    imgSize: [img.width, img.height],
                                    color: icon.getColor(),
                                }),
                                zIndex: 2,
                            })
                        );
                    };
                    hoveredFeatureRef.current = featureAtPixel;
                }
            } else if (hoveredFeatureRef.current) {
                hoveredFeatureRef.current.setStyle(hoveredFeatureRef.current.initialStyle);
                hoveredFeatureRef.current = null;
            }

            if (hit) {
                const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
                if (feature?.get("documentId")) {
                    const documentId = feature.get("documentId");
                    const matchedDocument = allDocuments.find((doc) => doc.id === documentId);
                    if (matchedDocument?.areaId) {
                        if (matchedDocument?.area?.geojson) {
                            const geojsonFormat = new GeoJSON();
                            try {
                                const areaFeatures = geojsonFormat.readFeatures(
                                    matchedDocument?.area.geojson,
                                    {
                                        featureProjection: "EPSG:3857",
                                    }
                                );
                                hoverSource.addFeatures(areaFeatures);
                            } catch (error) {
                                console.error("Errore nel parsing del GeoJSON per hover:", error);
                            }
                        }
                    }
                }
            }
        }
    };

    map.on("pointermove", handlePointerMove);

    return () => {
        map.un("pointermove", handlePointerMove);
        map.removeLayer(hoverLayer);
    };
}