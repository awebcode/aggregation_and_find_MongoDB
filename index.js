const express = require("express");
const { db, Student, Depertment, Department } = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world!" });
});

app.post("/student", async (req, res) => {
  const { name, departmentId, details } = req.body;
  const data = await Student.create({ name, departmentId, details });
  res.status(200).json({ message: "Added", user: data });
});

app.delete("/student", async (req, res) => {
  const data = await Student.deleteMany({ name: { $exists: false } });
  res.status(200).json({ message: "Added", user: data });
});

//aggregate

app.get("/student", async (req, res) => {
  const data = await Student.aggregate([]);
  res.status(200).json({ message: "data", user: data });
});

app.get("/depertments", async (req, res) => {
  // Create text indexes on the fields
  //http://localhost:5000/depertments?searchTerm=RST City&manager=Olivia&minPrice=2000&maxPrice=3550000&page=1&limit=2&sortOrder=desc&sortByField=budget
  const { searchTerm, manager, minPrice, maxPrice, page, limit, sortOrder, sortByField } =
    req.query;

  const sortCriteria = {};
  sortCriteria[sortByField] = sortOrder === "asc" ? 1 : -1;
  console.log("sort", sortCriteria); //budget:1 or -1
  console.log("search", searchTerm, manager);
  const data = await Department.aggregate([
    // {
    //   $match: {
    //     $and: [
    //       {
    //         budget: {
    //           $gte: minPrice ? Number(minPrice) : 0,
    //           $lte: maxPrice ? Number(maxPrice) : 10000000,
    //         },
    //       },
    //       { manager: manager ? manager : "" },
    //       // { $text: { $search: searchTerm ? searchTerm : "" } },
    //       //if i use $text field for search required need to create schema file for text base field where apply text base search
    //       // like this >>>>>> await depertmentSchema.index({ name: "text", manager: "text", location: "text" }); in schema file
    //       {
    //         $or: [
    //           { name: { $regex: searchTerm, $options: "i" } },
    //           {
    //             manager: { $regex: searchTerm, $options: "i" },
    //           },
    //           { location: { $regex: searchTerm, $options: "i" } },
    //         ],
    //       },
    //     ],
    //   },
    // },
    // { $sort: sortCriteria },
    // {
    //   $skip: Number((page - 1) * limit) || 0,
    // },
    // {
    //   $limit:Number(limit) || 2, //Number(limit) || 2
    // },

    {
      $group: {
        _id: { name: "$manager" },
        minBudget: { $min: "$budget" },
        maxBudget: { $max: "$budget" },
        avgBudget: { $avg: "$budget" },
        sumBudget: { $sum: "$budget" },
        books: { $push: "$$ROOT" }, // or books: { $push: {names:"$name"}}
      },
    },
  ]);
  res.status(200).json({ message: "data", count: data.length, depertments: data });
});

db();

app.listen(5000, () => {
  console.log("Server Running");
});
