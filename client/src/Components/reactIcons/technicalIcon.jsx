import React from "react";

const TechnicalIcon = ({
    size = 24,
    fillPrimary = "white",
    fillTertiary = "#000000",
    ...props
}) => (
    <svg
        viewBox="0 0 384 512"
        width="80"
        height="80"
        version="1.1"
        id="svg2"
        sodipodi:docname="technical.svg"
        inkscape:version="1.4 (86a8ad7, 2024-10-11)"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
    >
        <defs id="defs2" />
        <sodipodi:namedview
            id="namedview2"
            pagecolor="#ffffff"
            bordercolor="#000000"
            borderopacity="0.25"
            inkscape:showpageshadow="2"
            inkscape:pageopacity="0.0"
            inkscape:pagecheckerboard="0"
            inkscape:deskcolor="#d1d1d1"
            inkscape:zoom="9.6625"
            inkscape:cx="40"
            inkscape:cy="40"
            inkscape:window-width="1920"
            inkscape:window-height="991"
            inkscape:window-x="-9"
            inkscape:window-y="-9"
            inkscape:window-maximized="1"
            inkscape:current-layer="svg2"
        />
        <circle
            cx="192"
            cy="255.99998"
            fill="#d3d3d3"
            id="circle1"
            style={{ strokeWidth: 1.02852, fill: fillTertiary }}
            r="56.568539%"
        />
        <circle
            style={{ fill: fillPrimary, strokeWidth: 27.3974 }}
            id="path3"
            cx="192"
            cy="256"
            r="224"
        />
        <g id="g2" transform="matrix(0.7,0,0,0.6125,57.6,99.2)">
            <path
                d="M 0,64 C 0,28.7 28.7,0 64,0 h 160 v 128 c 0,17.7 14.3,32 32,32 h 128 v 288 c 0,35.3 -28.7,64 -64,64 H 64 C 28.7,512 0,483.3 0,448 Z m 384,64 H 256 V 0 Z"
                id="path1"
            />
            <g transform="translate(0,-100)" id="gear">
                <path
                    transform="matrix(10.6,0,0,10.3,-517.5,-900.8)"
                    d="m 52.1,129.2 h 5 l 2,-5 h 5 l 2,5 h 5 v 5 h -5 l -2,5 h -5 l -2,-5 h -5 z"
                    style={{ stroke: fillPrimary, strokeWidth: 2 }}
                    strokeWidth="2"
                    id="path2"
                />
                <circle
                    transform="matrix(10.6,0,0,10.3,-523.6,-900.8)"
                    cx="62.700001"
                    cy="131.7"
                    r="2"
                    style={{ stroke: fillPrimary, strokeWidth: 2 }}
                    strokeWidth="2"
                    id="circle2"
                />
            </g>
        </g>
    </svg>
);

export default TechnicalIcon;
