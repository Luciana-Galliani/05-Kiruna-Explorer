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
        description = null
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
    }

    matchFilter(document) {
        /*return (
            (this.title === null || this.title === "" || document.title === this.title) &&
            (this.scaleType === null || this.scaleType === "" || document.scaleType === this.scaleType) &&
            (this.scaleValue === null || this.scaleValue === "" || document.scaleValue === this.scaleValue) &&
            (this.author === null || this.author === "" || document.author === this.author) &&
            (this.issuanceDate === null || this.issuanceDate === "" || document.issuanceDate === this.issuanceDate) &&
            (this.type === null || this.type === "" || document.type === this.type) &&
            (this.language === null || this.language === "" || document.language === this.language) &&
            (this.description === null || this.description === "" || document.description === this.description) &&
            (this.allMunicipality === false || document.allMunicipality === this.allMunicipality)
        );*/

        const titleMatch = this.title === null || this.title === "" || document.title.toLowerCase().includes(this.title.toLowerCase());
        const scaleTypeMatch = this.scaleType === null || this.scaleType === "" || document.scaleType.toLowerCase().includes(this.scaleType.toLowerCase());
        const scaleValueMatch = this.scaleValue === null || this.scaleValue === "" || document.scaleValue.toLowerCase().includes(this.scaleValue.toLowerCase());
        const authorMatch = this.author === null || this.author === "" || document.author.toLowerCase().includes(this.author.toLowerCase());
        const issuanceDateMatch = this.issuanceDate === null || this.issuanceDate === "" || document.issuanceDate === this.issuanceDate;
        const typeMatch = this.type === null || this.type === "" || document.type === this.type;
        const languageMatch = this.language === null || this.language === "" || document.language.toLowerCase().includes(this.language.toLowerCase());
        const descriptionMatch = this.description === null || this.description === "" || document.description.toLowerCase().includes(this.description.toLowerCase());
        const allMunicipalityMatch = this.allMunicipality === false || document.allMunicipality === this.allMunicipality;

        return titleMatch && scaleTypeMatch && scaleValueMatch && authorMatch && issuanceDateMatch && typeMatch && languageMatch && descriptionMatch && allMunicipalityMatch;

    }
}

export default Filter;