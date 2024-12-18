import React from "react";
import PropTypes from "prop-types";

const InformativeIcon = ({
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
        sodipodi:docname="informative.svg"
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
            inkscape:cx="49.210867"
            inkscape:cy="39.172057"
            inkscape:window-width="1920"
            inkscape:window-height="991"
            inkscape:window-x="-9"
            inkscape:window-y="-9"
            inkscape:window-maximized="1"
            inkscape:current-layer="svg2"
        />
        <circle
            cx="192"
            cy="256"
            fill="#d3d3d3"
            id="circle1"
            style={{ strokeWidth: 1.02852, fill: fillTertiary }}
            r="56.568539%"
        />
        <circle
            style={{ fill: fillPrimary, strokeWidth: 10.7682 }}
            id="path4"
            cx="192"
            cy="256"
            r="224"
        />
        <g id="g4" transform="translate(-21.857699,-1.324709)">
            <path
                d="m 9.9353169,41.849418 c 0,-21.62125 20.0900001,-39.2000001 44.8000001,-39.2000001 H 166.73532 V 81.049418 c 0,10.84125 10.01,19.600002 22.4,19.600002 h 89.6 v 176.4 c 0,21.62125 -20.09,39.2 -44.8,39.2 H 54.735317 c -24.71,0 -44.8000001,-17.57875 -44.8000001,-39.2 z m 268.8000031,39.2 h -89.6 V 2.6494179 Z"
                id="path1"
                style={{ strokeWidth: 0.65479 }}
                transform="translate(69.522381,97.87529)"
            />
            <ellipse
                cx="126.17056"
                cy="232.49042"
                style={{ stroke: fillPrimary, strokeWidth: 11.6364 }}
                strokeWidth="11.6364"
                fill="none"
                id="circle2"
                rx="58.181797"
                ry="58.181805"
                transform="translate(35.742304,102.51177)"
            />
            <text
                transform="matrix(1.1837908,0,0,0.84474387,35.742304,102.51177)"
                x="106.63596"
                y="278.69421"
                textAnchor="middle"
                fontSize="73.0873px"
                fontFamily="Arial"
                dy="21.926174"
                id="text2"
                style={{ fill: fillPrimary, strokeWidth: 6.09061 }}
            >
                i
            </text>
            <g id="g3" transform="translate(35.742304,102.51177)" />
            <g id="Informative circle" transform="translate(35.742302,102.51177)" />
        </g>
    </svg>
);

InformativeIcon.propTypes = {
    size: PropTypes.number,
    fillPrimary: PropTypes.string,
    fillTertiary: PropTypes.string,
};

export default InformativeIcon;
