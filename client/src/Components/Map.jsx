import React, { useEffect, useRef, useState } from "react";
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
import API from "../API/API.mjs";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import { none } from "ol/centerconstraint";
import DetailsPanel from "./DetailsPanel";
import { useLocation } from "react-router-dom";



const CityMap = ({ isSelectingCoordinates, handleCoordinatesSelected, allDocuments, setAllDocuments, isLoggedIn }) => {
    const location = useLocation();


    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [selectedDocument, setSelectedDocument] = useState(null);


    const longitude = 20.22513;
    const latitude = 67.85572;

    // Define bounding coordinates for latitude and longitude
    const MIN_LAT = 67.5;
    const MAX_LAT = 68.17;
    const MIN_LNG = 19.09;
    const MAX_LNG = 21.3;

    const iconMap = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        "Agreement": agreementIcon,
        "Conflict": conflictIcon,
        "Consultation": consultationIcon,
        "Action": actionIcon,
    };

    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                const response = await API.getDocuments();
                setAllDocuments(response.documents);
            } catch (err) {
                throw new Error("Failed to fetch documents:", err.message);
            }
        };

        fetchAllDocuments();
    }, []);

    useEffect(() => {
        // Transform extent to the map projection
        const extent = transformExtent(
            [MIN_LNG, MIN_LAT, MAX_LNG, MAX_LAT],
            "EPSG:4326",
            "EPSG:3857"
        );
        const cityCenter = fromLonLat([longitude, latitude]);

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM({
                        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                    }),
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

    }, []);

    useEffect(() => {
        if (!allDocuments || allDocuments.length === 0) return;

        const features = allDocuments
            .filter((doc) => doc.longitude !== null && doc.latitude !== null)
            .map((doc) => {
                const { longitude, latitude, stakeholders } = doc;
                const location = fromLonLat([longitude, latitude]);

                const feature = new Feature({
                    geometry: new Point(location),
                    documentId: doc.id,
                    documentTitle: doc.title
                });

                let colorIcon = stakeholders && stakeholders.length === 1 ? stakeholders[0].color : "purple";

                const img = new Image();
                img.src = iconMap[doc.type];

                img.onload = () => {
                    feature.setStyle([
                        new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                img: img,
                                imgSize: [img.width, img.height],
                                scale: 0.4,
                                color: stakeholders[0].name !== "LKAB" ? colorIcon : "white",
                            }),
                        })
                    ]);
                };

                return feature;
            });

        const vectorSource = new VectorSource({
            features: features,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const satelliteLayer = new TileLayer({
            source: new OSM({
                url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            }),
        });

        const map = mapInstanceRef.current;
        if (map) {
            map.addLayer(vectorLayer);
            map.on("click", (event) => {
                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                    const documentTitle = feature.get("documentTitle");
                    console.log(documentTitle);
                    const matchedDocument = allDocuments.find(doc => doc.title === documentTitle);
                    setSelectedDocument(matchedDocument);
                    console.log(matchedDocument);

                });
            });
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
            <div style={{ height: "100%" }}>
                <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>

                {selectedDocument && location.pathname == "/" && (
                    <DetailsPanel
                        doc={selectedDocument}
                        onClose={() => setSelectedDocument(null)} // Close the details panel
                        isLoggedIn={isLoggedIn}
                    />
                )}
            </div>
        </div>
    );
};


export default CityMap;