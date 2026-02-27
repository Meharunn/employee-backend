const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://shaik:shaik123@cluster0.4zkuawn.mongodb.net/employeesDB")
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log("Error:", err));

const employeeSchema = new mongoose.Schema({
  empname: String,
  empid: String,
  companyName: String,
  companyOwner: String,
  noOfEmployees: Number,
  description: String,
  tags: [String]
});

const Employee = mongoose.model("Employee", employeeSchema);

//
// CREATE
//
app.post("/add", async (req, res) => {
  const employee = new Employee(req.body);
  await employee.save();
  res.json(employee);
});

//
// GET ALL
//
app.get("/all", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});



//
// SEARCH BY KEYWORD (description)
//
//
// GLOBAL SEARCH (name OR id OR company OR owner)
//
app.get("/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;

  const employees = await Employee.find({
    $or: [
      { empname: { $regex: keyword, $options: "i" } },
      { empid: { $regex: keyword, $options: "i" } },
      { companyName: { $regex: keyword, $options: "i" } },
      { companyOwner: { $regex: keyword, $options: "i" } }
    ]
  });

  res.json(employees);
});

//
// GET BY ID
//
app.get("/getbyid/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.json(employee);
});

//
// UPDATE
//
app.put("/update/:id", async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

//
// DELETE
//
app.delete("/delete/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

// UPDATE

app.put("/update/:id", async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});