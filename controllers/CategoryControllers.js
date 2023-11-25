const { Category, Product } = require('../models')
const { formatCurrency } = require('../utils/currency')

class CategoryController {
    
    // ENDPOINT UNRUK MENAMBAHKAN CATEGORIES
    static async addCategories(req, res) {
        try {
            
            const { type } = req.body
            const newcategory = await Category.create({ type })

            res.status(201).json({
                status: 201,
                category: newcategory
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK GET CATEGORY
    static async getAllCategories(req, res) {
        try {
            
            const data = await Category.findAll({
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId', 'createdAt', 'updatedAt']
                    },
                ],
            })

            const formattedCategories = data.map((category) => {
                return {
                    id: category.id,
                    type: category.type,
                    sold_product_amount: category.sold_product_amount,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    products: category.Products.map((product) => {
                        return {
                            id: product.id,
                            title: product.title,
                            price: formatCurrency(product.price),
                            stock: product.stock,
                            CategoryId: product.CategoryId,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt
                        };
                    }),
                }
            })

            res.status(200).json({
                status: 200,
                categories: formattedCategories
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK UPDATE CATEGORY
    static async updatedCategories(req, res) {
        try {
            
            const categoryId = req.params.id
            const { type } = req.body

            const data = await Category.findByPk(categoryId)
            if (!data) {
                throw {
                    code: 404,
                    message: 'Category tidak ada'
                }
            }

            if (type) {
                data.type = type
            }
            await data.save()

            res.status(200).json({
                status: 200,
                data
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK MENGHAPUS CATEGORY
    static async deletedCategories(req, res) {
        try {
            
            const categoryId = req.params.id
            const category = await Category.findByPk(categoryId)

            if (!category) {
                throw {
                    code: 404,
                    message: 'Category tidak ditemukan'
                }
            }

            await category.destroy()

            res.status(200).json({
                status: 200,
                message: "Category has been succesfully deleted",
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

}

module.exports = CategoryController