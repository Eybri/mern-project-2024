class APILayout {
    constructor(query, queryStr) {
        this.query = query;  
        this.queryStr = queryStr;  
    }
    priceFilter() {
        if (this.queryStr.price) {
            const priceRange = this.queryStr.price.split('-'); 
            if (priceRange.length === 2) {
                const minPrice = Number(priceRange[0]);
                const maxPrice = Number(priceRange[1]);
                this.query = this.query.where('price').gte(minPrice).lte(maxPrice);
            }
        }
        return this;
    }

    ratingFilter() {
        if (this.queryStr.rating) {
            const minRating = Number(this.queryStr.rating);
            // console.log(`Applying rating filter:`, minRating);  
            this.query = this.query.where('averageRating').gte(minRating);
        }
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1); 

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;  
    }

}

module.exports = APILayout;
