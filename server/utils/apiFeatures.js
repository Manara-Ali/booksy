module.exports = class APIFeatures {
  constructor(query, queryParameters) {
    this.query = query;
    this.queryParameters = queryParameters;
  }

  filter() {
    // 1. FILTERING
    let queryObj = { ...this.queryParameters };

    const unwantedParams = ["sort", "page", "limit", "fields"];

    unwantedParams.forEach((element) => {
      delete queryObj[element];
    });

    // 2. ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj).replace(
      /(lt|lte|gt|gte|ne|eq|or)/g,
      (match) => `$${match}`
    );

    queryStr = JSON.parse(queryStr);

    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    // 3. SORTING
    if (this.queryParameters.sort) {
      // Define the sorting parameter
      const sortBy = this.queryParameters.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    // 4. PAGINATION
    const page = this.queryParameters.page || 1;

    const limit = this.queryParameters.limit || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  limit() {
    // 5. FIELD LIMIT
    if (this.queryParameters.fields) {
      const fieldLimit = this.queryParameters.fields.split(",").join(" ");

      this.query = this.query.select(fieldLimit);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }
};
