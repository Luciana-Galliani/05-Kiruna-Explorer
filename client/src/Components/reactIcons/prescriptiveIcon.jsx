import React from "react";

const ActionIcon = ({
  size = 24,
  fillPrimary = "white",
  fillSecondary = "gray",
  ...props
}) => (
   <svg
      viewBox="0 0 384 512"
      width="80"
      height="80"
      version="1.1"
      id="svg1"
      sodipodi:docname="prescriptive.svg"
      inkscape:version="1.4 (86a8ad7, 2024-10-11)"
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg">
     <defs
        id="defs1" />
     <sodipodi:namedview
        id="namedview1"
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
        inkscape:current-layer="svg1" />
     <circle
        cx="192"
        cy="256"
        fill="#d3d3d3"
        id="circle1"
        style={{strokeWidth:1.02852, fill:"#000000"}}
        r="56.568539%" />
     <circle
        style={{fill:"#ffffff", strokeWidth:58.5187}}
        id="path2"
        cx="192"
        cy="256"
        r="224"
        fill={{fillPrimary}}/>
     <g
        id="g1"
        transform="matrix(0.7,0,0,0.6125,57.6,99.2)">
       <path
          d="M 0,64 C 0,28.7 28.7,0 64,0 h 160 v 128 c 0,17.7 14.3,32 32,32 h 128 v 288 c 0,35.3 -28.7,64 -64,64 H 64 C 28.7,512 0,483.3 0,448 Z m 384,64 H 256 V 0 Z"
          id="path1" />
       <g
          transform="translate(0,-100)"
          id="forward">
         <polygon
            transform="matrix(7.5,0,0,5.1,-331.7,-2150.5)"
            points="49.2,529.1 59.2,529.1 59.2,532.1 69.2,527.1 59.2,522.1 59.2,525.1 49.2,525.1 "
            stroke="#ffffff"
            stroke-width="2"
            fill="#ffffff"
            id="polygon1" />
       </g>
     </g>
   </svg>

    
);

export default ActionIcon;
