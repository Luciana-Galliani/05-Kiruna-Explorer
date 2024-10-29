export default async function populateDB(sequelize) {
    console.log("Populating the database...");
    const { Document, Stakeholder } = sequelize.models;
    try {
        // Create stakeholders
        const stakeholders = await Stakeholder.bulkCreate(
            [
                {
                    name: "LKAB",
                    color: "#000000",
                },
                {
                    name: "Municipality",
                    color: "#FF0000",
                },
                {
                    name: "Norrbotten County",
                    color: "#00FF00",
                },
                {
                    name: "Architecture firms",
                    color: "#0000FF",
                },
                {
                    name: "Citizens",
                    color: "#FFFF00",
                },
                {
                    name: "Others",
                    color: "#00FFFF",
                },
            ],
            { validate: true }
        );

        //Create documents
        const documents = await Document.bulkCreate(
            [
                {
                    title: "Compilation of responses “So what the people of Kiruna think?” (15)",
                    scaleType: "Text",
                    issuanceDate: "2007",
                    type: "Informative Document",
                    language: "Swedish",
                    description:
                        "This document is a compilation of the responses to the survey 'What is your impression of Kiruna?' From the citizens' responses to this last part of the survey, it is evident that certain buildings, such as the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant value to the population. The municipality views the experience of this survey positively, to the extent that over the years it will propose various consultation opportunities.",
                },
                {
                    title: "Detail plan for Bolagsomradet Gruvstadspark (18)",
                    scaleType: "Plan",
                    scaleValue: "1:8.000",
                    issuanceDate: "2010-10-20",
                    type: "Prescriptive Document",
                    language: "Swedish",
                    pages: "1-32",
                    description:
                        "This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the residential areas into mining industry zones to allow the demolition of buildings. The area includes the town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a text explaining the reasons that led to the drafting of the plan with these characteristics. The plan gained legal validity in 2012.",
                },
                {
                    title: "Development Plan (41)",
                    scaleType: "Plan",
                    scaleValue: "1:7.500",
                    issuanceDate: "2014-03-17",
                    type: "Design Document",
                    language: "Swedish",
                    pages: "111",
                    description:
                        "The development plan shapes the form of the new city. The document, unlike previous competition documents, is written entirely in Swedish, which reflects the target audience: the citizens of Kiruna. The plan obviously contains many elements of the winning masterplan from the competition, some recommended by the jury, and others that were deemed appropriate to integrate later. The document is divided into four parts, with the third part, spanning 80 pages, describing the shape the new city will take and the strategies to be implemented for its relocation through plans, sections, images, diagrams, and texts. The document also includes numerous studies aimed at demonstrating the future success of the project.",
                },
            ],
            { validate: true }
        );

        await documents[0].setStakeholders([stakeholders[1], stakeholders[4]]);
        await documents[1].setStakeholders(stakeholders[1]);
        await documents[2].setStakeholders([stakeholders[1], stakeholders[3]]);

        await documents[0].addConnectedDocument(documents[1], {
            through: { relationship: "Update" },
        });
        await documents[1].addConnectedDocument(documents[0], {
            through: { relationship: "Update" },
        });
        await documents[1].addConnectedDocument(documents[2], {
            through: { relationship: "Collateral Consequence" },
        });
        await documents[2].addConnectedDocument(documents[1], {
            through: { relationship: "Collateral Consequence" },
        });

        console.log("Database populated successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
