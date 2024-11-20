export class Stakeholder {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}

export class Connection {
    constructor(targetDocument, relationship) {
        this.targetDocument = targetDocument;
        this.relationship = relationship;
    }
}