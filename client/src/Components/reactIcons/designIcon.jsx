import React from "react";

const DesignIcon = ({ size = 24, fillPrimary = "white", fillTertiary = "#ffffff", ...props }) => (
    <svg
        viewBox="0 0 384 512"
        width="80"
        height="80"
        version="1.1"
        id="svg4"
        sodipodi:docname="design.svg"
        inkscape:version="1.4 (86a8ad7, 2024-10-11)"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
    >
        <defs id="defs4" />
        <sodipodi:namedview
            id="namedview4"
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
            inkscape:current-layer="svg4"
        />
        <circle
            cx="192"
            cy="256"
            id="circle1"
            style={{ strokeWidth: 1.02852, fill: fillTertiary }}
            r="56.568539%"
        />
        <circle
            style={{ fill: fillPrimary, strokeWidth: 135.275 }}
            id="path4"
            cx="192"
            cy="256"
            r="224"
        />
        <g id="g4" transform="matrix(0.875,0,0,0.875,23.9475,37.67875)">
            <path
                transform="matrix(0.8,0,0,0.7,29.9,65.2)"
                d="m 10.7,71.3 c 0,-35.3 28.7,-64 64,-64 h 160 v 128 c 0,17.7 14.3,32 32,32 h 128 v 288 c 0,35.3 -28.7,64 -64,64 h -256 c -35.3,0 -64,-28.7 -64,-64 z m 384,64 h -128 V 7.3 Z"
                id="path1"
            />
            <g transform="matrix(0.8,0,0,0.7,21.3,191.8)" id="g3">
                <path
                    transform="matrix(9.3,0,0,7.7,-570.7,-1052)"
                    d="m 69.3,165.1 10,-10 10,10 v 10 h -20 z"
                    stroke="black"
                    strokeWidth="2"
                    style={{ fill: fillPrimary }}
                    id="path2"
                />
                <path
                    transform="matrix(9.3,0,0,7.7,-570.7,-1116.2)"
                    d="m 76.3,183.4 v -7 h 6 v 7 z"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ fill: fillPrimary }}
                    id="path3"
                />
            </g>
        </g>
    </svg>
);

export default DesignIcon;
