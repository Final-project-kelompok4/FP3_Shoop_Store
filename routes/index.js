const router = require('express').Router()
const { authenticationToken } = require('../middleware/auth')
const { isAdminRoleMiddleware }= require('../middleware/authIsAdmin')
const UserController = require('../controllers/UserControllers')
const CategoryController = require('../controllers/CategoryControllers')
const ProductController = require('../controllers/ProductControllers')
const TransactionController = require('../controllers/TransactionControllers')

// rute user
router.post("/users/register", UserController.registerUsers)
router.post("/users/login", UserController.loginUsers)
router.put("/users", authenticationToken, UserController.updateUsersPut)
router.patch("/users/topup", authenticationToken, UserController.topUpUsers)
router.delete("/users", authenticationToken, UserController.deletedUsers)

// rute category
router.post("/categories", authenticationToken, isAdminRoleMiddleware, CategoryController.addCategories)
router.get("/categories", authenticationToken, isAdminRoleMiddleware, CategoryController.getAllCategories)
router.patch("/categories/:id", authenticationToken, isAdminRoleMiddleware, CategoryController.updatedCategories)
router.delete("/categories/:id", authenticationToken, isAdminRoleMiddleware, CategoryController.deletedCategories)

// rute product
router.post("/products", authenticationToken, isAdminRoleMiddleware, ProductController.addProducts)
router.get("/products", authenticationToken, ProductController.getAllProducts)
router.put("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.updatedPutProduct)
router.patch("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.updatedCategoryId)
router.delete("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.deletedProducts)

// rute untuk riwayat transaksi
router.post("/transactions", authenticationToken, TransactionController.addTransaction)
router.get("/transactions/user", authenticationToken, TransactionController.getTransactionByUser)
router.get("/transactions/admin", authenticationToken, isAdminRoleMiddleware, TransactionController.getTransactionAdmin)
router.get("/transactions/:id", authenticationToken, TransactionController.getTransactionById)


module.exports = router