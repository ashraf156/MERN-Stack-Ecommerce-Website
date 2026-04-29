const Product = require("../modles/productModles");

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createProduct = async (req, res) => {
  try {
    const { title, price, description, content, images, category } = req.body;

    // Validate required fields
    if (!title || !price || !description || !content || !images || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    // Validate price and content are numbers
    if (typeof price !== "number" || typeof content !== "number") {
      return res.status(400).json({
        success: false,
        message: "Price and content must be numbers",
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ title: title.trim() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this title already exists",
      });
    }

    // Create new product
    const newProduct = new Product({
      title: title.trim(),
      price,
      description: description.trim(),
      content,
      images,
      category: category.trim(),
      checked: false,
      sold: 0,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all products with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Get products with pagination
    const products = await Product.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const pages = Math.ceil(total / limit);

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
        total: 0,
        pages: 0,
        currentPage: page,
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      total,
      pages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get a single product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Delete a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      description,
      content,
      images,
      category,
      checked,
      sold,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields if provided
    if (title) product.title = title.trim();
    if (price !== undefined && typeof price === "number") product.price = price;
    if (description) product.description = description.trim();
    if (content !== undefined && typeof content === "number")
      product.content = content;
    if (images) product.images = images;
    if (category) product.category = category.trim();
    if (checked !== undefined) product.checked = checked;
    if (sold !== undefined && typeof sold === "number") product.sold = sold;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deleteProduct,
  updateProduct,
};
