const categories = require("../modles/categoryModles");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const existingCategory = await categories.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await categories.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const category = await categories.find({});
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categories.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await categories.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categories.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
