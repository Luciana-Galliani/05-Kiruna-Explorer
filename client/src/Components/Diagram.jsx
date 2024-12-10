import React, { useState, useEffect, useRef } from "react";
import API from "../API/API.mjs";
import * as d3 from "d3";
import { min, max, range } from "d3-array";

// Function to process the documents and return the nodes and links
const processDocuments = (documents) => {
    const scales = new Map();
    const nodes = [];
    const links = [];
    const minYear = min(documents.map((doc) => new Date(doc.issuanceDate).getFullYear()));
    const maxYear = max(documents.map((doc) => new Date(doc.issuanceDate).getFullYear()));
    const years = range(minYear, maxYear + 1);

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
        });

        // Add connections
        doc.connections.forEach((connection) => {
            links.push({
                source: doc.id,
                target: connection.targetDocument.id,
                relationship: connection.relationship,
            });
        });
    });

    return { nodes, links, scales: Array.from(scales.keys()), years };
};

export default function Diagram() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const svgRef = useRef();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await API.getDocuments();
                setDocuments(response.documents);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDocuments();
    }, []);

    useEffect(() => {
        const { nodes, links, scales, years } = processDocuments(documents);

        const margin = { top: 50, right: 50, bottom: 60, left: 110 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - 60 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove();

        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Scales
        const xScale = d3
            .scaleTime()
            .domain([new Date(years[0], 0, 1), new Date(years[years.length - 1], 11, 31)])
            .range([0, width]);

        const yScale = d3.scaleBand().domain(scales).range([0, height]);

        // white alternating columns
        g.selectAll(".year-column")
            .data(years.filter((y) => y % 2 === 0))
            .enter()
            .append("rect")
            .attr("class", "year-column")
            .attr("x", (d) => xScale(new Date(d, 0, 1)))
            .attr("y", 0)
            .attr("width", xScale(new Date(years[1], 0, 1)) - xScale(new Date(years[0], 0, 1)))
            .attr("height", height)
            .attr("fill", "white")
            .attr("opacity", 0.2);

        // Horizontal lines
        g.selectAll(".horizontal-grid")
            .data(scales)
            .enter()
            .append("line")
            .attr("class", "horizontal-grid")
            .attr("x1", (d, i) => ((d[0] !== "1" || scales[i - 1][0]) !== "1" ? -80 : 0))
            .attr("x2", width)
            .attr("y1", (d) => (yScale(d) % 1 === 0.0 ? yScale(d) + 0.5 : yScale(d))) // add 0.5 to avoid weird graphical glitches
            .attr("y2", (d) => (yScale(d) % 1 === 0.0 ? yScale(d) + 0.5 : yScale(d))) // add 0.5 to avoid weird graphical glitches
            .attr("stroke", "black")
            .attr("stroke-width", "1");

        // Axis
        g.append("g").call(d3.axisLeft(yScale));
        g.append("g").call(d3.axisTop(xScale));

        // Connections
        g.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", (d) => xScale(new Date(nodes.find((n) => n.id === d.source).date)))
            .attr(
                "y1",
                (d) => yScale(nodes.find((n) => n.id === d.source).scale) + yScale.bandwidth() / 2
            )
            .attr("x2", (d) => xScale(new Date(nodes.find((n) => n.id === d.target).date)))
            .attr(
                "y2",
                (d) => yScale(nodes.find((n) => n.id === d.target).scale) + yScale.bandwidth() / 2
            )
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Nodes
        g.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", (d) => xScale(new Date(d.date)))
            .attr("cy", (d) => {
                return yScale(d.scale) + yScale.bandwidth() / 2;
            })
            .attr("r", 5)
            .attr("fill", (d) => (d.stakeholders.length ? d.stakeholders[0].color : "#000"));
    }, [documents, dimensions]);

    return <svg ref={svgRef}></svg>;
}
