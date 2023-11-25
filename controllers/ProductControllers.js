const { Product, Category } = require('../models')
const { formatCurrency } = require('../utils/currency')

class ProductController {

    // ENPOINT MEANMBAHKAN PRODUCTS 
    static async addProducts(req, res) {
        try {
            
            const {
                title, price, stock, CategoryId
            } = req.body

            const category = await Category.findByPk(CategoryId)
            if (!category) {
                throw {
                    code: 404,
                    message: 'Category tidak ada'
                }
            }

            const data = await Product.create({
                title, price, stock, CategoryId
            })

            data.price = formatCurrency(data.price)

            res.status(201).json({
                status: 201,
                product: data
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENPOINT UNTUK GET ALL PRODUCTS
    static async getAllProducts(req, res) {
        try {
            
            const products = await Product.findAll({
                include: Category
            })

            const formattedProducts = products.map((product) => {
                return {
                    id: product.id,
                    title: product.title,
                    price: formatCurrency(product.price),
                    stock: product.stock,
                    CategoryId: product.CategoryId,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                }
            })

            res.status(200).json({
                status: 200,
                products: formattedProducts
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UPDATE PRODUCT
    static async updatedPutProduct(req, res) {
        try {
            
            const productId = req.params.id

            const {
                price, stock, title
            } = req.body

            const data = await Product.findByPk(productId)

            if(!data) {
                throw {
                    code: 404,
                    message: 'Data Tidak Ada'
                }
            }

            data.title = title || data.title
            data.price = price || data.price
            data.stock = stock || data.stock

            await data.save()

            res.status(200).json({
                status: 200,
                data
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UPDATE CATEGORY ID
    static async updatedCategoryId(req, res) {
        try {
            
            const productId = req.params.id
            const { CategoryId } = req.body

            const data = await Product.findByPk(productId)

            if(!data) {
                throw {
                    code: 404,
                    message: 'Product Tidak Ada'
                }
            }

            const category = await Category.findByPk(CategoryId)
            if(!category) {
                throw {
                    code: 404,
                    message: 'Category Tidak Ada'
                }
            }

            data.CategoryId = CategoryId

            await data.save()

            res.status(200).json({
                status: 200,
                data
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK MENGHAPUS PRODUCT
    static async deletedProducts(req, res) {
        try {
            
            const productId = req.params.id

            const product = await Product.findByPk(productId)

            if(!product) {
                throw {
                    code: 404,
                    message: 'Product tidak ada'
                }
            }

            await product.destroy()

            res.status(200).json({
                status: 200,
                message: 'Product has been successfully deleted',
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

}

module.exports = ProductController