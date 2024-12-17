import Diagram from "./Diagram";
import Legend from "./Legend";

export default function DiagramPage(seeOnMap) {
    return (
        <div
            className="w-100 h-100 position-absolute top-0 diagram-container"
            style={{
                backgroundColor: "gray",
                textAlign: "center",
                paddingTop: "60px",
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            <Diagram seeOnMap={seeOnMap} />
            <Legend />
        </div>
    );
}
