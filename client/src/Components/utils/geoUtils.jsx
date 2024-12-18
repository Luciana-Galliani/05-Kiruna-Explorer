import { boundingExtent } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Stroke, Icon, Fill } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { getIconForType } from './iconUtils';
import { reset } from "ol/transform";

function getRandomPointNearAreaCenter(area) {
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
        
        // if length of stakeholders is equal to 1, get the color of the first stakeholder, else use purple
        const docColor = doc.stakeholders?.length === 1 ? doc.stakeholders[0].color : "purple";
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(getIconForType(doc.type, docColor))}`;
        img.onload = () => {
            const initialStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    img: img,
                    scale: 0.5,
                    imgSize: [img.width, img.height],
                    //color: doc.stakeholders?.[0]?.color || "purple",
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

    // Improve the hover event, this not working properly

    /*const docId = hoveredFeatureRef.current?.get("documentId");
    console.log(docId);
    const matchedDocument = allDocuments.find((doc) => doc.id === docId);
    const docColor = matchedDocument?.stakeholders?.length === 1 ? matchedDocument.stakeholders[0].color : "purple";
    */
    
    const hoverSource = new VectorSource();
    const hoverLayer = new VectorLayer({
        source: hoverSource,
        style: new Style({
            stroke: new Stroke({
                color: "rgba(255, 165, 0, 0.8)", // Colore per l'effetto hover
                width: 3,
            }),
            fill: new Fill({
                color: "rgba(255, 165, 0, 0.2)", // Colore per l'effetto hover
            }),
        }),
    });

    map.addLayer(hoverLayer);

    const handlePointerMove = (event) => {
        hoverSource.clear();
        if (isSelectingCoordinates) {
            setCursorStyle("pointer");
        } else {
            const hit = map.hasFeatureAtPixel(event.pixel);
            setCursorStyle(hit ? "pointer" : "");
            handleFeatureHover(event.pixel);
            if (hit) handleHoverLayer(event.pixel);
        }
    };

    const setCursorStyle = (style) => {
        map.getTargetElement().style.cursor = style;
    };

    const handleFeatureHover = (pixel) => {
        const featureAtPixel = findFeatureAtPixel(pixel, "documentLayer");
        if (featureAtPixel /*&& !featureAtPixel.get("clicked")*/) {
            updateFeatureHighlight(featureAtPixel);
        } else {
            resetHighlightedFeature();
        }
    };

    const findFeatureAtPixel = (pixel, layerName) => {
        return map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer?.get("name") === layerName) return feature;
        });
    };

    const updateFeatureHighlight = (feature) => {
        if (hoveredFeatureRef.current !== feature) {
            resetHighlightedFeature();
            applyHoverStyle(feature);
            hoveredFeatureRef.current = feature;
        }
    };

    const resetHighlightedFeature = () => {
        if (hoveredFeatureRef.current) {
            hoveredFeatureRef.current.setStyle(hoveredFeatureRef.current.initialStyle);
            hoveredFeatureRef.current = null;
        }
    };

    const applyHoverStyle = (feature) => {
        const currentStyle = feature.getStyle();
        const icon = currentStyle.getImage();
        const img = new Image();
        img.src = icon.getSrc();
        img.onload = () => {
            feature.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 0.5],
                        img: img,
                        scale: 0.55,
                        imgSize: [img.width, img.height],
                        //color: icon.getColor(),
                    }),
                    zIndex: 2,
                })
            );
        };
    };

    const handleHoverLayer = (pixel) => {
        const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
        if (feature?.get("documentId")) {
            const documentId = feature.get("documentId");
            const matchedDocument = findMatchedDocument(documentId);
            if (matchedDocument?.areaId && matchedDocument?.area?.geojson) {
                addGeoJSONToHoverSource(matchedDocument.area.geojson);
            }
        }
    };

    const findMatchedDocument = (documentId) => {
        return allDocuments.find((doc) => doc.id === documentId);
    };

    const addGeoJSONToHoverSource = (geojson) => {
        const geojsonFormat = new GeoJSON();
        try {
            const areaFeatures = geojsonFormat.readFeatures(geojson, {
                featureProjection: "EPSG:3857",
            });
            hoverSource.addFeatures(areaFeatures);
        } catch (error) {
            console.error("Error parsing GeoJSON for hover:", error);
        }
    };

    // Attach and detach the pointermove event
    map.on("pointermove", handlePointerMove);

    return () => {
        map.un("pointermove", handlePointerMove);
        map.removeLayer(hoverLayer);
    };

}

export function applyClickEffect({ mapInstanceRef, clickedFeatureRef, doc }) {
    const map = mapInstanceRef.current;

    const resetPreviousFeatureStyle = () => {
        if (clickedFeatureRef.current) {
            const previousFeature = clickedFeatureRef.current;
            const initialStyle = previousFeature.get("initialStyle");
            if (initialStyle) {
                previousFeature.setStyle(initialStyle);
            }
            previousFeature.set("clicked", false);
            clickedFeatureRef.current = null;
        }
    };

    const applyClickStyle = (feature, doc) => {
        const docColor = doc.stakeholders?.length === 1 ? doc.stakeholders[0].color : "purple";
        const img = new Image();
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(getIconForType(doc.type, docColor, true))}`;

        const currentStyle = feature.getStyle();
        feature.set("initialStyle", currentStyle);

        img.onload = () => {
            const newStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    img: img,
                    scale: 0.50,
                    imgSize: [img.width, img.height],
                }),
                zIndex: 3,
            });

            feature.setStyle(newStyle);
            feature.set("clicked", true);
            clickedFeatureRef.current = feature;
        };
    };

    const handleClick = (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
        if (feature) {
            resetPreviousFeatureStyle();
            applyClickStyle(feature, doc);
        }
    };

    map.on("click", handleClick);
    return () => {
        map.un("click", handleClick);
    };
}
