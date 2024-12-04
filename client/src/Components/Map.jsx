import React, { useEffect, useRef, useState, useContext } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat, transformExtent, transform } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import { GeoJSON } from "ol/format";
import Draw from "ol/interaction/Draw";
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
import DetailsPanel from "./DetailsPanel";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import PropTypes from "prop-types";
import { boundingExtent } from "ol/extent";

const CityMap = ({ handleCoordinatesSelected, isSatelliteView, handleAreaSelected }) => {
    const location = useLocation();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const hoveredFeatureRef = useRef(null);
    const [drawnArea, setDrawnArea] = useState(null);
    const [areas, setAreas] = useState([]);
    const drawInteractionRef = useRef(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLayer, setDocumentLayer] = useState(null);
    const [boundaryLayer, setBoundaryLayer] = useState(null);

    function getRandomPointNearAreaCenter(area) {
        const centerLat = parseFloat(area.centerLat);
        const centerLon = parseFloat(area.centerLon);
        const geojson = area.geojson;

        // Calculate extent of the area in geographic coordinates
        const geometryExtent = boundingExtent(geojson.coordinates[0]); // Assumes Polygon or MultiPolygon
        const [minX, minY, maxX, maxY] = geometryExtent.map((coord) => toLonLat([coord])[0]);

        // Calculate the maximum offsets (10% of the extent size)
        const MIN_OFFSET = 0.01; // Minimum offset for small areas
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

    const {
        setAllDocuments,
        allDocuments,
        isLoggedIn,
        isSelectingCoordinates,
        isSelectingArea,
        areaGeoJSON,
        setAreaGeoJSON,
    } = useContext(AppContext);

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
        Other: otherIcon,
    };

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
    }, [drawnArea]);

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

    // Drawing area interaction
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
            const geometry = feature.getGeometry();
            const geojsonFormat = new GeoJSON();

            const drawnGeoJSON = geojsonFormat.writeFeatureObject(feature, {
                featureProjection: "EPSG:3857",
                dataProjection: "EPSG:4326",
            });

            setAreaGeoJSON(drawnGeoJSON);

            const coordinates = geometry.getCoordinates();
            const coordsIn4326 = coordinates[0].map((coord) =>
                transform(coord, "EPSG:3857", "EPSG:4326")
            );
            setDrawnArea(coordsIn4326);
            handleAreaSelected(coordsIn4326);

            map.removeInteraction(drawInteraction);
            map.removeLayer(drawLayer);
            drawInteractionRef.current = null;
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

        // Update document layer (icons)
        if (shouldShow && allDocuments?.length > 0) {
            const features = allDocuments
                .map((doc) => {
                    let location;
                    if (doc.longitude !== null && doc.latitude !== null) {
                        // Use document coordinates
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
                })
                .filter((feature) => feature !== null); // Remove null features

            const vectorSource = new VectorSource({ features });
            const newDocumentLayer = new VectorLayer({
                name: "documentLayer",
                source: vectorSource,
            });

            map.addLayer(newDocumentLayer);

            if (documentLayer) map.removeLayer(documentLayer); // Remove old layer
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

    useEffect(() => {
        const map = mapInstanceRef.current;
        const hoverSource = new VectorSource();
        const hoverLayer = new VectorLayer({
            source: hoverSource,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(255, 165, 0, 0.8)", // Orange color for hover effect
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
                // If we hover a feature
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
                                    console.error("Failed to parse GeoJSON for hover:", error);
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
    }, [allDocuments, areas, isSelectingCoordinates, isSatelliteView]);

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
