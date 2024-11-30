import React, { useEffect, useRef, useState, useContext } from "react";
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
import Stroke from "ol/style/Stroke";
import { GeoJSON } from "ol/format";
import API from "../API/API.mjs";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import DetailsPanel from "./DetailsPanel";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import PropTypes from "prop-types";

const CityMap = ({ handleCoordinatesSelected, isSatelliteView }) => {
    const location = useLocation();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLayer, setDocumentLayer] = useState(null);
    const [boundaryLayer, setBoundaryLayer] = useState(null);

    const { setAllDocuments, allDocuments, isLoggedIn, isSelectingCoordinates } =
        useContext(AppContext);

    const longitude = 20.22513;
    const latitude = 67.85572;

    const iconMap = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        Agreement: agreementIcon,
        Conflict: conflictIcon,
        Consultation: consultationIcon,
        Action: actionIcon,
    };

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
    }, []);

    // Initialize map
    useEffect(() => {
        const extent = transformExtent(
            [17.53, 67.21, 23.17, 69.3], // Bounding box for Kiruna
            "EPSG:4326",
            "EPSG:3857"
        );
        const cityCenter = fromLonLat([longitude, latitude]);

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

    // Update map with documents and boundaries
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const shouldShow =
            !(location.pathname === "/add" || location.pathname.includes("edit")) ||
            isSelectingCoordinates;

        // Update document layer (icons)
        if (shouldShow && allDocuments?.length > 0) {
            const features = allDocuments
                .filter((doc) => doc.longitude !== null && doc.latitude !== null)
                .map((doc) => {
                    const location = fromLonLat([doc.longitude, doc.latitude]);
                    const feature = new Feature({
                        geometry: new Point(location),
                        documentId: doc.id,
                        documentTitle: doc.title,
                    });

                    const img = new Image();
                    img.src = iconMap[doc.type];
                    img.onload = () => {
                        feature.setStyle(
                            new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    img: img,
                                    scale: 0.4,
                                    imgSize: [img.width, img.height],
                                    color: doc.stakeholders?.[0]?.color || "purple",
                                }),
                            })
                        );
                    };

                    return feature;
                });

            const vectorSource = new VectorSource({ features });
            const newDocumentLayer = new VectorLayer({ source: vectorSource });

            map.addLayer(newDocumentLayer);

            if (documentLayer) map.removeLayer(documentLayer); // Remove old layer
            setDocumentLayer(newDocumentLayer);
        } else if (documentLayer) {
            map.removeLayer(documentLayer);
            setDocumentLayer(null);
        }

        // Update boundary layer
        if (shouldShow) {
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
    }, [allDocuments, location.pathname, isSelectingCoordinates]);

    // Center the map on the selected document
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedDocument) return;

        if (selectedDocument.longitude && selectedDocument.latitude) {
            const location = fromLonLat([selectedDocument.longitude, selectedDocument.latitude]);
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
                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                    const documentId = feature.get("documentId");
                    const matchedDocument = allDocuments.find((doc) => doc.id === documentId);
                    setSelectedDocument(matchedDocument);
                });
            }
        };

        map.on("click", handleMapClick);
        return () => {
            map.un("click", handleMapClick);
        };
    }, [isSelectingCoordinates, handleCoordinatesSelected, allDocuments]);

    return (
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
            {selectedDocument && location.pathname === "/" && (
                <DetailsPanel
                    doc={selectedDocument.id}
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
};

export default CityMap;
