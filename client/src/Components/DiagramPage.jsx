import Diagram from "./Diagram";

export default function DiagramPage() {
    return (
        <div
            className="w-100 h-100 position-absolute top-0 "
            style={{ backgroundColor: "gray", textAlign: "center", paddingTop: "60px" }}
        >
            <Diagram />
        </div>
    );
}
