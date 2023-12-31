const { default: mongoose } = require("mongoose");

exports.db = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Asikur:12345@cluster0.txiokqr.mongodb.net/aggregation"
    );

    console.log("Mongodb connected!");
  } catch (error) {
    console.log("mongodb not connected!");
    console.log(error);
  }
};

exports.Student =
  mongoose.models.Student ||
  mongoose.model(
    "Student",
    new mongoose.Schema({
      name: String,
      departmentId: mongoose.Schema.Types.ObjectId,
      details: {
        name: String,
        age: Number,
        position: String,
      },
    })
  );
const depSchema = new mongoose.Schema({
  name: String,
  location: String,
  manager: String,
  budget: Number,
  numEmployees: Number,
  foundedYear: Number,
});
exports.Department =
  mongoose.models.Department || mongoose.model("Department", depSchema);
//this indexing for when multiple filled with $text $search on the documents with aggregation framework
depSchema.index({ name: "text", manager: "text", location: "text" });
