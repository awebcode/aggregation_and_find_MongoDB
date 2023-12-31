const searchTerm = "your_search_query_here";
const minPrice = 50; // Minimum price
const maxPrice = 100; // Maximum price
const category = "Electronics"; // Category to filter

const sortByField = "price"; // User-provided field to sort by
const sortOrder = "desc"; // User-provided sort direction: "asc" for ascending, "desc" for descending

const pageNumber = 1; // Page number
const pageSize = 10; // Number of documents per page

const allowedFields = ["price", "createdAt", "inStock", "active"];
const allowedSortOrders = ["asc", "desc"];

if (allowedFields.includes(sortByField) && allowedSortOrders.includes(sortOrder)) {
  const sortCriteria = {};
  sortCriteria[sortByField] = sortOrder === "asc" ? 1 : -1;

  db.userData.aggregate([
    {
      $match: {
        $and: [
          { budget: { $gte: minPrice, $lte: maxPrice } },
          { category: category },
          {
            $or: [
              { title: { $regex: searchTerm, $options: "i" } },
              { description: { $regex: searchTerm, $options: "i" } },
            ],
          },
        ],
      },
    },
    {
      $sort: sortCriteria,
    },
    {
      $skip: (pageNumber - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ]);
} else {
  // Handle error or provide default sorting if the user-provided field or sort order is invalid
}
