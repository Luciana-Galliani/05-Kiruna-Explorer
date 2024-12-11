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
  console.log(darkerUtils("black"))
  const docSecondColor = docColorDark ? darkerUtils(docColor, 30) : "black";
  console.log(docSecondColor)

  const iconMap = {
    Action: (props) => <ActionIcon fillPrimary={docColor} fillTertiary={docSecondColor} {...props} />,
    Agreement: (props) => <AgreementIcon fillPrimary={docColor} {...props} />,
    Conflict: (props) => <ConflictIcon fillPrimary={docColor} {...props} />,
    Consultation: (props) => <ConsultationIcon fillPrimary={docColor} {...props} />,
    Other: (props) => <OtherIcon fillPrimary={docColor} {...props} />,
    "Prescriptive Document": (props) => <PrescriptiveIcon fillPrimary={docColor} {...props} />,
    "Technical Document": (props) => <TechnicalIcon fillPrimary={docColor} {...props} />,
    "Design Document": (props) => <DesignIcon fillPrimary={docColor} {...props} />,
    "Informative Document": (props) => <InformativeIcon fillPrimary={docColor} {...props} />,
    // Add more mappings as needed
  };

  // Render the corresponding React component as a string
  return ReactDOMServer.renderToStaticMarkup(iconMap[docType]?.({}) || <ActionIcon />);
}

export { 
    getIconForType
};