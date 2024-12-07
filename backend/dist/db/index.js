"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const mongo_uri = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb://localhost:27017/Roxiler-db";
mongoose_1.default.connect(mongo_uri);
const productSchema = new mongoose_1.default.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: String
});
exports.ProductModel = mongoose_1.default.model("Product", productSchema);
