"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./db/index");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
app.get("/api/v1/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const data = response.data;
        yield index_1.ProductModel.deleteMany();
        yield index_1.ProductModel.insertMany(data);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/api/v1/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = "", page = 1, perPage = 10 } = req.query;
        const pageNum = parseInt(page);
        const perPageNum = parseInt(perPage);
        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { price: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const docCount = yield index_1.ProductModel.countDocuments(query);
        const transactions = yield index_1.ProductModel.find(query)
            .skip((pageNum - 1) * perPageNum)
            .limit(perPageNum);
        res.status(500).json({
            page: pageNum,
            perPage: perPageNum,
            totalRecords: docCount,
            totalPages: Math.ceil(docCount / perPageNum),
            data: transactions,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occured while fetching data" });
    }
}));
app.get("/api/v1/statistics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, year } = req.query;
    if (!month || !year) {
        res.status(400).json({ message: "Month and year are required" });
        return;
    }
    const selectedMonth = parseInt(month);
    const selectedYear = parseInt(year);
    try {
        const products = yield index_1.ProductModel.find({
            dateOfSale: {
                $gte: new Date(selectedYear, selectedMonth - 1, 1),
                $lt: new Date(selectedYear, selectedMonth, 1),
            },
        });
        const totalSaleAmount = products
            .filter((product) => product.sold)
            .reduce((sum, product) => sum + product.price, 0);
        const totalSoldItems = products.filter((product) => product.sold).length;
        const totalNotSoldItems = products.filter((product) => !product.sold).length;
        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching statistics", error });
    }
}));
app.get("/api/v1/bar-chart", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    if (!month) {
        res.status(400).json({ message: "Month is required" });
        return;
    }
    const selectedMonth = parseInt(month);
    try {
        const products = yield index_1.ProductModel.find({
            dateOfSale: {
                $gte: new Date(0, selectedMonth - 1, 1),
                $lt: new Date(9999, selectedMonth, 1),
            },
        });
        const priceRanges = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0,
        };
        products.forEach((product) => {
            if (product.price <= 100)
                priceRanges["0-100"]++;
            else if (product.price <= 200)
                priceRanges["101-200"]++;
            else if (product.price <= 300)
                priceRanges["201-300"]++;
            else if (product.price <= 400)
                priceRanges["301-400"]++;
            else if (product.price <= 500)
                priceRanges["401-500"]++;
            else if (product.price <= 600)
                priceRanges["501-600"]++;
            else if (product.price <= 700)
                priceRanges["601-700"]++;
            else if (product.price <= 800)
                priceRanges["701-800"]++;
            else if (product.price <= 900)
                priceRanges["801-900"]++;
            else
                priceRanges["901-above"]++;
        });
        res.status(200).json(priceRanges);
    }
    catch (error) {
        res.status(500).json({ message: "Error generating bar chart data", error });
    }
}));
app.get("/api/v1/pie-chart", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    if (!month) {
        res.status(400).json({ message: "Month is required" });
        return;
    }
    const selectedMonth = parseInt(month);
    try {
        const products = yield index_1.ProductModel.find({
            dateOfSale: {
                $gte: new Date(0, selectedMonth - 1, 1),
                $lt: new Date(9999, selectedMonth, 1),
            },
        });
        const categoryCounts = {};
        products.forEach((product) => {
            if (product && product.category) {
                categoryCounts[product.category] =
                    (categoryCounts[product.category] || 0) + 1;
            }
        });
        res.status(200).json(categoryCounts);
    }
    catch (error) {
        res.status(500).json({ message: "Error generating pie chart data", error });
    }
}));
app.get("/api/v1/combined-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, year } = req.query;
    if (!month) {
        res.status(400).json({ message: "Month is required" });
        return;
    }
    try {
        const statisticsResponse = yield axios_1.default.get(`${BASE_URL}/api/v1/statistics?month=${month}&year=${year}`);
        const barChartResponse = yield axios_1.default.get(`${BASE_URL}/api/v1/bar-chart?month=${month}`);
        const pieChartResponse = yield axios_1.default.get(`${BASE_URL}/api/v1/pie-chart?month=${month}`);
        const combinedData = {
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data,
        };
        res.status(200).json(combinedData);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching combined data", error });
    }
}));
app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
