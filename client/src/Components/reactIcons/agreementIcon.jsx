import React from "react";
import PropTypes from "prop-types";

const AgreementIcon = ({
  size = 24,
  fillPrimary = "white",
  fillTertiary = "#000000",
  ...props
}) => (
    <svg
       viewBox="0 0 640 512"
       width="80"
       height="80"
       version="1.1"
       id="svg1"
       sodipodi:docname="agreement.svg"
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
         bordercolor="#999999"
         borderopacity="1"
         inkscape:showpageshadow="2"
         inkscape:pageopacity="0"
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
         cx="320"
         cy="256"
         fill="#d3d3d3"
         id="circle1"
         style={{fill: fillTertiary, strokeWidth:1.00392}}
         r="55.215763%" />
      <circle
         style={{fill:fillPrimary, strokeWidth:61.5045}}
         id="path4"
         cx="320"
         cy="256"
         r="280" 
         />
      <path
         d="m 322.44553,137.20465 -69.62587,56.3912 c -11.58035,9.35059 -13.81009,26.18164 -5.03493,38.19354 9.27865,12.8031 27.33247,15.32056 39.77594,5.61034 l 71.42406,-55.52806 c 5.03493,-3.8841 12.22769,-3.02096 16.1837,2.01396 3.95602,5.03494 3.02096,12.22769 -2.01397,16.1837 l -15.03286,11.65227 99.97931,92.06727 V 167.98965 h -0.5035 l -2.80517,-1.7982 -52.21942,-33.4463 c -11.00491,-7.0489 -23.87993,-10.78913 -36.97075,-10.78913 -15.68022,0 -30.92886,5.39456 -43.15654,15.24863 z m 16.39948,89.47788 -37.18654,28.91488 c -22.65718,17.69418 -55.52808,13.09081 -72.50298,-10.21372 -15.96792,-21.9379 -11.93997,-52.57904 9.1348,-69.62588 l 59.84373,-48.40723 c -8.3436,-3.52445 -17.33455,-5.32264 -26.46934,-5.32264 -13.52238,-0.0719 -26.68513,3.95602 -37.97776,11.43648 l -51.78783,34.52523 v 161.11772 h 20.28357 l 65.74179,59.98758 c 14.09779,12.87503 35.89184,11.86805 48.76688,-2.22976 3.95601,-4.38758 6.61733,-9.49443 7.98396,-14.81707 l 12.22768,11.2207 c 14.02587,12.87503 35.89185,11.93997 48.76688,-2.0859 3.23675,-3.52445 5.61035,-7.62432 7.12083,-11.86804 13.95396,9.35057 32.94282,7.40853 44.66702,-5.39457 12.87503,-14.02587 11.93997,-35.89185 -2.0859,-48.76689 z M 101.34023,167.98965 c -6.329615,0 -11.508405,5.17878 -11.508405,11.5084 v 149.60932 c 0,12.73118 10.285635,23.01682 23.016815,23.01682 h 23.01681 c 12.73119,0 23.01682,-10.28564 23.01682,-23.01682 V 167.98965 Z m 23.01681,138.1009 a 11.508411,11.508411 0 1 1 0,23.01682 11.508411,11.508411 0 1 1 0,-23.01682 z m 356.76067,-138.1009 v 161.11772 c 0,12.73118 10.28565,23.01682 23.01682,23.01682 h 23.01682 c 12.73118,0 23.01683,-10.28564 23.01683,-23.01682 V 179.49805 c 0,-6.32962 -5.17878,-11.5084 -11.50841,-11.5084 z m 23.01682,149.60932 a 11.50841,11.50841 0 1 1 23.01682,0 11.50841,11.50841 0 1 1 -23.01682,0 z"
         id="path1"
         style={{strokeWidth:0.719276}} />
    </svg>
    
);

AgreementIcon.propTypes = {
   size: PropTypes.number,
   fillPrimary: PropTypes.string,
   fillTertiary: PropTypes.string,
};

export default AgreementIcon;