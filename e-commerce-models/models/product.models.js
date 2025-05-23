import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    description: {
      require: true,
      type: String,
    },
    name: {
      require: true,
      type: String,
    },
    productImage: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

// MongoDB name will be plural of Product auto
