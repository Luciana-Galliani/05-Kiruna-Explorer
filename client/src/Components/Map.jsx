import { useAreaDrawing } from "./UseAreaDrawing";
import { useMapSetup } from "./UseMapSetup";
// external libraries
import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// OpenLayers
import "ol/ol.css";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { GeoJSON } from "ol/format";
import { Style, Stroke } from "ol/style";

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
import ClusterDetailsPanel from "./ClusterDetailsPanel";
import { AppContext } from "../context/AppContext";
import { createDocumentLayer, handleMapPointerMove } from "./utils/geoUtils";

const CityMap = ({ handleCoordinatesSelected, isSatelliteView, handleAreaSelected }) => {
    const mapRef = useRef(null);
    const location = useLocation();
    const hoveredFeatureRef = useRef(null);
    const [areas, setAreas] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLayer, setDocumentLayer] = useState(null);
    const [boundaryLayer, setBoundaryLayer] = useState(null);

    const [selectedCluster, setSelectedCluster] = useState(null);

    const { setAllDocuments, allDocuments, isLoggedIn, isSelectingArea, areaGeoJSON, setAreaGeoJSON, isSelectingCoordinates } = useContext(AppContext);

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
    const mapInstanceRef = useMapSetup({ mapRef, isSatelliteView });
    useAreaDrawing({ mapInstanceRef, isSelectingArea, setAreaGeoJSON, handleAreaSelected });

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

    //draw new area
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

    //draw documents and boundaries
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
                handleCoordinateSelection(event);
            } else {
                const clickedFeature = findClickedFeature(event.pixel);
        
                if (clickedFeature) {
                    const features = clickedFeature.get("features"); // Clustered features
                    if (features?.length > 1) {
                        // Cluster clicked
                        const clusterDocuments = features.map((feature) => {
                            const documentId = feature.get("documentId");
                            return findMatchedDocument(documentId);
                        });
                        setSelectedCluster(clusterDocuments); // Open ClusterDetailsPanel
                        setSelectedDocument(null); // Clear single document selection
                    } else {
                        // Single document clicked
                        const documentId = features?.[0]?.get("documentId");
                        const matchedDocument = findMatchedDocument(documentId);
                        setSelectedDocument(matchedDocument); // Open DetailsPanel
                        setSelectedCluster(null); // Clear cluster selection
                    }
                } else {
                    // Click outside any feature
                    setSelectedDocument(null);
                    setSelectedCluster(null);
                }
            }
        };
        
        const handleCoordinateSelection = (event) => {
            const [lon, lat] = toLonLat(event.coordinate);
            handleCoordinatesSelected(lon, lat);
        };

        const findClickedFeature = (pixel) => {
            let clickedFeature = null;

            map.forEachFeatureAtPixel(pixel, (feature) => {
                clickedFeature = feature;
            });

            return clickedFeature;
        };

        const findMatchedDocument = (documentId) => {
            return allDocuments.find((doc) => doc.id === documentId) || null;
        };

        const handleGlobalClick = (event) => {
            const mapElement = mapRef.current;

            if (
                mapElement &&
                !mapElement.contains(event.target) &&
                !event.target.closest(".details-panel")
            ) {
                setSelectedDocument(null);
            }
        };

        map.on("click", handleMapClick);
        document.addEventListener("click", handleGlobalClick);

        return () => {
            map.un("click", handleMapClick);
            document.removeEventListener("click", handleGlobalClick);
        };
    }, [isSelectingCoordinates, handleCoordinatesSelected, allDocuments]);

    //hover effect
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
            {selectedCluster && location.pathname === "/" && (
                <ClusterDetailsPanel
                    documents={selectedCluster}
                    onClose={() => setSelectedCluster(null)}
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
