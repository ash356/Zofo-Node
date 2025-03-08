// 01- Pagination Query
export const paginateQuery = (mongooseQuery, reqQuery) => {
    // ( * 1 ) to convert into number
    let page = reqQuery.page * 1 || 1;
    if (page < 0) {
        page = 1;
    }
    const limit = reqQuery.limit * 1 || 10; // Default limit = 10
    const skip = (page - 1) * limit;
    return { mongooseQuery: mongooseQuery.skip(skip).limit(limit), page };
};
// 02- Filter Query (gt,gte,lt,lte)
export const filterQuery = (mongooseQuery, reqQuery) => {
    // Take a deep copy of the query
    let queryString = { ...reqQuery };
    // Array of Excluded
    const excludedFields = ["page", "sort", "keyword", "fields", "limit"];
    excludedFields.forEach((field) => delete queryString[field]);
    // Convert into String
    // Replace gte => $gte
    queryString = JSON.stringify(queryString).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
    );
    // convert into json
    queryString = JSON.parse(queryString);
    return mongooseQuery.find(queryString);
};
// 03- Sort (name , -name , price , sold)
export const sortQuery = (mongooseQuery, reqQuery) => {
    if (reqQuery.sort) {
        const sortedBy = reqQuery.sort.split(",").join(" ");
        console.log(typeof mongooseQuery);
        return mongooseQuery.sort(sortedBy);
    }
    return mongooseQuery;
};
// 04- Search  ( name or description )
export const searchQuery = (mongooseQuery, reqQuery) => {
    if (reqQuery.keyword) {
        const keyword = reqQuery.keyword;
        return mongooseQuery.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        });
    }
    return mongooseQuery;
};
// 05- Select Fields (name , -_id , soldCount)
export const selectFieldsQuery = (mongooseQuery, reqQuery) => {
    if (reqQuery.fields) {
        const fields = reqQuery.fields.replace(/,/g, " ");
        return mongooseQuery.select(fields);
    }
    return mongooseQuery;
};
