import ReactDOMServer from "react-dom/server";
import ActionIcon from "../reactIcons/actionIcon";
import TechnicalIcon from "../reactIcons/technicalIcon";
import DesignIcon from "../reactIcons/designIcon";
import InformativeIcon from "../reactIcons/informativeIcon";
import AgreementIcon from "../reactIcons/agreementIcon";
import ConflictIcon from "../reactIcons/conflictIcon";
import ConsultationIcon from "../reactIcons/consultationIcon";
import OtherIcon from "../reactIcons/otherIcon";
import PrescriptiveIcon from "../reactIcons/prescriptiveIcon";

import darkerUtils from "./darkerUtils";

function getIconForType(docType, docColor, docColorDark) {
  // Calculate the second color based, bug in darkerUtils
  let docSecondColor;
  if(docColor === "purple" && docColorDark) {
    docSecondColor = "#4B0082";
  } else {
    docSecondColor = (docColorDark ? darkerUtils(docColor, 30) : "black");
  }
  

  const iconMap = {
    Action: (props) => <ActionIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    Agreement: (props) => <AgreementIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    Conflict: (props) => <ConflictIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    Consultation: (props) => <ConsultationIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    Other: (props) => <OtherIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    "Prescriptive Document": (props) => <PrescriptiveIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    "Technical Document": (props) => <TechnicalIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    "Design Document": (props) => <DesignIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    "Informative Document": (props) => <InformativeIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    // Add more mappings as needed
  };

  // Render the corresponding React component as a string
  return ReactDOMServer.renderToStaticMarkup(iconMap[docType]?.({}) || <ActionIcon />);
}

export { 
    getIconForType
};