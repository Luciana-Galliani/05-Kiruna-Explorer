import { useAreaDrawing } from "./UseAreaDrawing";
import { useMapSetup } from "./UseMapSetup";
// external libraries
import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// OpenLayers
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat, transformExtent, transform } from "ol/proj";
import { GeoJSON } from "ol/format";
import { Draw } from "ol/interaction";
import { Style, Icon, Stroke } from "ol/style";

// Icons and API
import API from "../API/API.mjs";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import otherIcon from "../Icons/other.svg";

// internal components and appContext
import DetailsPanel from "./DetailsPanel";
import { AppContext } from "../context/AppContext";
import { createDocumentLayer, handleMapPointerMove } from "./utils/geoUtils";

const CityMap = ({ handleCoordinatesSelected, isSatelliteView, handleAreaSelected }) => {
    const location = useLocation();
    const hoveredFeatureRef = useRef(null);
    const [areas, setAreas] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLayer, setDocumentLayer] = useState(null);
    const [boundaryLayer, setBoundaryLayer] = useState(null);

    const {
        setAllDocuments,
        allDocuments,
        isLoggedIn,
        isSelectingArea,
        areaGeoJSON,
    } = useContext(AppContext);

    const iconMap = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        Agreement: agreementIcon,
        Conflict: conflictIcon,
        Consultation: consultationIcon,
        Action: actionIcon,
        Other: otherIcon,
    };
    const mapRef = useRef(null);
    const { isSelectingCoordinates, setAreaGeoJSON } = useContext(AppContext);

    const mapInstanceRef = useMapSetup({ mapRef, isSatelliteView });
    useAreaDrawing({
        mapInstanceRef,
        isSelectingArea,
        setAreaGeoJSON,
        handleAreaSelected,
    });

    useEffect(() => {
        const loadAreas = async () => {
            try {
                const fetchedAreas = await API.fetchAreas();
                setAreas(fetchedAreas);
            } catch (error) {
                console.error("Failed to load areas:", error);
            }
        };
        loadAreas();
    }, []);

    // Fetch all documents on load
    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                const response = await API.getDocuments();
                setAllDocuments(response.documents);
            } catch (err) {
                console.error("Failed to fetch documents:", err.message);
            }
        };

        fetchAllDocuments();
    }, [isSatelliteView]);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !areaGeoJSON || isSelectingArea) return;

        const areaSource = new VectorSource();
        const areaLayer = new VectorLayer({
            source: areaSource,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(0, 255, 0, 0.8)",
                    width: 2,
                }),
            }),
        });

        const geojsonFormat = new GeoJSON();
        try {
            const features = geojsonFormat.readFeatures(areaGeoJSON, {
                featureProjection: "EPSG:3857",
            });
            areaSource.addFeatures(features);
        } catch (error) {
            console.error("Error in GeoJSON:", error);
        }
        map.addLayer(areaLayer);

        return () => {
            map.removeLayer(areaLayer);
        };
    }, [isSelectingArea, areaGeoJSON]);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const shouldShow =
            !(location.pathname === "/add" || location.pathname.includes("edit")) ||
            isSelectingCoordinates;

        // if `shouldShow` is true and there are documents, create layer
        if (shouldShow && allDocuments?.length > 0) {
            const newDocumentLayer = createDocumentLayer(allDocuments, iconMap);
            // Add layer to the map
            if (newDocumentLayer) {
                map.addLayer(newDocumentLayer);
            }
            // Remove old layer
            if (documentLayer) {
                map.removeLayer(documentLayer);
            }
            // set new layer
            setDocumentLayer(newDocumentLayer);
        } else if (documentLayer) {
            map.removeLayer(documentLayer);
            setDocumentLayer(null);
        }

        // Update boundary layer
        if (shouldShow || isSelectingArea) {
            const fetchGeoJSON = async () => {
                const geojsonFormat = new GeoJSON();
                try {
                    const data = await API.getBoundaries();

                    const features = geojsonFormat.readFeatures(data, {
                        featureProjection: "EPSG:3857",
                    });

                    const vectorSource = new VectorSource({ features });
                    const newBoundaryLayer = new VectorLayer({
                        source: vectorSource,
                        style: new Style({
                            stroke: new Stroke({ color: "blue", width: 3 }),
                        }),
                    });

                    if (boundaryLayer) map.removeLayer(boundaryLayer);

                    map.addLayer(newBoundaryLayer);
                    setBoundaryLayer(newBoundaryLayer);
                } catch (err) {
                    console.error("Error loading GeoJSON", err);
                }
            };

            fetchGeoJSON();
        } else {
            map.removeLayer(boundaryLayer);
            setBoundaryLayer(null);
        }
    }, [allDocuments, areas, location.pathname, isSelectingCoordinates]);

    // Center the map on the selected document
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedDocument) return;

        if (selectedDocument.longitude && selectedDocument.latitude) {
            const location = fromLonLat([selectedDocument.longitude, selectedDocument.latitude]);
            map.getView().setCenter(location);
            map.getView().setZoom(14); // Adjust zoom level as needed
        } else if (selectedDocument.area) {
            const location = fromLonLat([selectedDocument.area.centerLon, selectedDocument.area.centerLat]);
            map.getView().setCenter(location);
            map.getView().setZoom(14); // Adjust zoom level as needed
        }
    }, [selectedDocument]);

    // Handle coordinate selection or document click
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const handleMapClick = (event) => {
            if (isSelectingCoordinates) {
                const [lon, lat] = toLonLat(event.coordinate);
                handleCoordinatesSelected(lon, lat);
            } else {
                let clickedOnFeature = false;

                // Controlla se il click è su una feature della mappa
                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                    const documentId = feature.get("documentId");
                    const matchedDocument = allDocuments.find((doc) => doc.id === documentId);
                    setSelectedDocument(matchedDocument);
                    clickedOnFeature = true;
                });

                // Se non è stata selezionata una feature, chiudi il pannello
                if (!clickedOnFeature) {
                    setSelectedDocument(null);
                }
            }
        };

        const handleGlobalClick = (event) => {
            const mapElement = mapRef.current;

            // Se il click è fuori dalla mappa e dal pannello, chiudi il pannello
            if (
                mapElement &&
                !mapElement.contains(event.target) && // Fuori dalla mappa
                !event.target.closest(".details-panel") // Fuori dal pannello dei dettagli
            ) {
                setSelectedDocument(null);
            }
        };

        // Aggiungi gli event listener
        map.on("click", handleMapClick);
        document.addEventListener("click", handleGlobalClick);

        // Cleanup per entrambi gli event listener
        return () => {
            map.un("click", handleMapClick);
            document.removeEventListener("click", handleGlobalClick);
        };
    }, [isSelectingCoordinates, handleCoordinatesSelected, allDocuments]);


    useEffect(() => {
        const cleanup = handleMapPointerMove({
            mapInstanceRef,
            hoveredFeatureRef,
            isSelectingCoordinates,
            allDocuments,
        });

        return cleanup; // remove effects when unmount component
    }, [allDocuments, areas, isSelectingCoordinates]);

    return (
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
            {selectedDocument && location.pathname === "/" && (
                <DetailsPanel
                    initialDocId={selectedDocument.id}
                    onClose={() => setSelectedDocument(null)}
                    isLoggedIn={isLoggedIn}
                />
            )}
        </div>
    );
};

CityMap.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleAreaSelected: PropTypes.func.isRequired,
};

export default CityMap;
