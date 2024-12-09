class Filter {
    constructor({
        allMunicipality = false,
        title = null,
        scaleType = null,
        scaleValue = null,
        author = null,
        issuanceDate = null,
        type = null,
        language = null,
        description = null,
        startRange = null,
        endRange = null
    } = {}) {
        this.title = title;
        this.scaleType = scaleType;
        this.scaleValue = scaleValue;
        this.author = author;
        this.issuanceDate = issuanceDate;
        this.type = type;
        this.language = language;
        this.description = description;
        this.allMunicipality = allMunicipality;
        this.startRange = startRange;
        this.endRange = endRange;
    }

    matchFilter(document) {

        const titleMatch = this.title === null || this.title === "" || document.title.toLowerCase().includes(this.title.toLowerCase());
        const scaleTypeMatch = this.scaleType === null || this.scaleType === "" || document.scaleType.toLowerCase().includes(this.scaleType.toLowerCase());
        const scaleValueMatch = this.scaleValue === null || this.scaleValue === "" || document.scaleValue.toLowerCase().includes(this.scaleValue.toLowerCase());
        const authorMatch = this.author === null || this.author === "" || document.stakeholders.some(stakeholder => stakeholder.name.toLowerCase().includes(this.author.toLowerCase()));
        const issuanceDateMatch = this.issuanceDate === null || this.issuanceDate === "" || new Date(document.issuanceDate).getFullYear() === parseInt(this.issuanceDate);
        const dateMatch = (this.startRange === null || this.startRange === "" || new Date(document.issuanceDate) >= new Date(this.startRange)) && (this.endRange === null || this.endRange === "" || new Date(document.issuanceDate) <= new Date(this.endRange));
        const typeMatch = this.type === null || this.type === "" || document.type === this.type;
        const languageMatch = this.language === null || this.language === "" || document.language.toLowerCase().includes(this.language.toLowerCase());
        const descriptionMatch = this.description === null || this.description === "" || document.description.toLowerCase().includes(this.description.toLowerCase());
        const allMunicipalityMatch = this.allMunicipality === false || document.allMunicipality === this.allMunicipality;

        return titleMatch && scaleTypeMatch && scaleValueMatch && authorMatch && issuanceDateMatch && typeMatch && languageMatch && descriptionMatch && allMunicipalityMatch && dateMatch;

    }
}

export default Filter;