// Funzione per calcolare i punti della curva Bézier con una serie di segmenti
const getBezierPoints = (link, nodes, xScale, steps = 20) => {
    const sourceNode = nodes.find((n) => n.id === link.source);
    const targetNode = nodes.find((n) => n.id === link.target);

    const sourceX = xScale(new Date(sourceNode.date));
    const sourceY = sourceNode.y;
    const targetX = xScale(new Date(targetNode.date));
    const targetY = targetNode.y;

    const controlPointX = Math.min(sourceX, targetX) + Math.abs(sourceX - targetX) * 0.2;
    const controlPointY = (sourceY + targetY) / 2 + Math.abs(sourceY - targetY) * 0.4;

    const points = [];
    // Suddividiamo la curva in più segmenti
    for (let t = 0; t <= 1; t += 1 / steps) {
        const x = (1 - t) * (1 - t) * sourceX + 2 * (1 - t) * t * controlPointX + t * t * targetX;
        const y = (1 - t) * (1 - t) * sourceY + 2 * (1 - t) * t * controlPointY + t * t * targetY;
        points.push([x, y]);
    }
    return points;
};

// Funzione per calcolare la distanza euclidea tra due punti
function euclideanDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

export const areLinksOverlapping = (link1, link2, nodes, xScale) => {
    const points1 = getBezierPoints(link1, nodes, xScale); // Punti della prima curva
    const points2 = getBezierPoints(link2, nodes, xScale); // Punti della seconda curva

    const threshold = 2; // Soglia per considerare due punti sovrapposti

    // Verifica se tutti i punti della curva 1 sono abbastanza vicini ai punti della curva 2
    return points1.every((point1, index) => {
        const point2 = points2[index];
        const distance = euclideanDistance(point1, point2);
        return distance < threshold;
    });
};

export const getBezierLine = (nodes, xScale, line, source, target) => {
    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);

    const sourceX = xScale(new Date(sourceNode.date));
    const sourceY = sourceNode.y;
    const targetX = xScale(new Date(targetNode.date));
    const targetY = targetNode.y;

    // Control point for the Bezier curve
    const controlPointX = Math.min(sourceX, targetX) + Math.abs(sourceX - targetX) * 0.2;
    const controlPointY = (sourceY + targetY) / 2 + Math.abs(sourceY - targetY) * 0.4;

    return line([
        [sourceX, sourceY],
        [controlPointX, controlPointY],
        [targetX, targetY],
    ]);
};

// Function to process the documents and return the nodes and links
export const processDocuments = (documents) => {
    const scales = new Map();
    const nodes = [];
    const links = [];
    const seenConnections = new Set(); // Set to store unique connections
    const minYear =
        Math.min(...documents.map((doc) => new Date(doc.issuanceDate).getFullYear())) - 1;
    const maxYear = Math.max(...documents.map((doc) => new Date(doc.issuanceDate).getFullYear()));
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    documents.forEach((doc) => {
        const issuanceDate = new Date(doc.issuanceDate);
        const year = issuanceDate.getFullYear();

        // Vertical scale
        let scaleKey = doc.scaleType;
        if (doc.scaleType === "Plan") {
            scaleKey = doc.scaleValue;
        }
        if (!scales.has(scaleKey)) {
            scales.set(scaleKey, scales.size);
        }

        // Add nodes
        nodes.push({
            id: doc.id,
            title: doc.title,
            year,
            date: doc.issuanceDate,
            scale: scaleKey,
            type: doc.type,
            stakeholders: doc.stakeholders,
            color: doc.stakeholders.length === 1 ? doc.stakeholders[0].color : "purple",
        });

        // Add connections
        doc.connections.forEach((connection) => {
            const source = doc.id;
            const target = connection.targetDocument.id;
            const relationship = connection.relationship;

            // Create a unique key for the connection
            const connectionKey =
                [source, target].sort((a, b) => a - b).join("-") + "-" + relationship;

            // Add connection only if it's not already seen
            if (!seenConnections.has(connectionKey)) {
                seenConnections.add(connectionKey);
                links.push({ source, target, relationship });
            }
        });
    });

    return { nodes, links, scales: Array.from(scales.keys()).sort().reverse(), years };
};
