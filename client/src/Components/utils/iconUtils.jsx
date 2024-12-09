import ReactDOMServer from "react-dom/server";
import ActionIcon from "../reactIcons/actionIcon";

function getIconForType(docType) {
  const iconMap = {
    Action: (props) => <ActionIcon fillPrimary="green" {...props} />,
    "Prescriptive Document": (props) => <ActionIcon fillPrimary="red" {...props} />,
    // Add more mappings as needed
  };

  // Render the corresponding React component as a string
  return ReactDOMServer.renderToStaticMarkup(iconMap[docType]?.({}) || <ActionIcon />);
}

export { 
    getIconForType
};