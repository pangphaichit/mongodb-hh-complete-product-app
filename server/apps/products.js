import { Router } from "express";
// Import database connection
import { db } from "../utils/db.js";
// Import ObjectId for converting string to ObjectId
import { ObjectId } from "mongodb";

const productRouter = Router();

// Get all products
productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const products = await collection
      .find({})
      .limit(100)
      .toArray();

    return res.json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// Get a product by ID
productRouter.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const productObjectId = new ObjectId(productId);

    const product = await db
      .collection("products")
      .findOne({ _id: productObjectId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
});

// Create a new product
productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productData = { ...req.body };

    const result = await collection.insertOne(productData);

    return res.json({
      message: "Product has been created successfully"
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

// Update an existing product by ID
productRouter.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const productObjectId = new ObjectId(productId);

    const newProductData = { ...req.body };

    const result = await db.collection("products").updateOne(
      { _id: productObjectId },
      { $set: newProductData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    return res.json({ message: "Product has been updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

// Delete a product by ID
productRouter.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const productObjectId = new ObjectId(productId);

    const result = await db.collection("products").deleteOne({ _id: productObjectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

export default productRouter;
