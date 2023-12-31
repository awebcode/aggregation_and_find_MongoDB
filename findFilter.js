app.get("/departments", async (req, res) => {
  const {
    searchTerm,
    category, //manager means category
    minPrice,
    maxPrice,
    page = 1,
    limit = 2,
    sortOrder = "asc",
    sortByField = "budget",
  } = req.query;

  const query = {};

  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    query.$or = [
      { name: searchRegex },
      {category: searchRegex },
      { location: searchRegex },
    ];
  }

  if (manager) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.budget = {};
    if (minPrice) {
      query.budget.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.budget.$lte = Number(maxPrice);
    }
  }

  try {
    const total = await Department.countDocuments(query);
    const sorting = { [sortByField]: sortOrder === "asc" ? 1 : -1 };

    const departments = await Department.find(query)
      .sort(sorting)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      total,
      currentPage: Number(page),
      pageCount: Number(total) / Number(limit),
      pageDocuments: departments.length, //limit
      departments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
