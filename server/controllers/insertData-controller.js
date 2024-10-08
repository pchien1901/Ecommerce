const Product = require("../models/product");
const Brand = require("../models/brand");
const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");
const products = require("../data/product.detail.json");
const brands = require("../data/brand.json");
const brandsWithPC = require("../data/brandWithCategory.json");
const categories = require("../data/category.json");
const slugify = require("slugify");

/**
 * Lưu một sản phẩm
 * @param {*} product sản phẩm
 * Author: PMChien(17/07/2024)
 */
const promiseInsertProduct = async (product) => {
    try {
        const { brand: brandTitle, category: productCategoryTitle } = product;
        //let brands = new Set();
        let categories = new Set();

        let brandInDb = await Brand.findOne({title: brandTitle});

        let productCategoryInDb = await ProductCategory.findOne({ title: productCategoryTitle });


        let productInDb = await Product.create({
            title: product?.name,
            description: product?.description,
            price: Math.round(Number(product?.price?.match(/\d/g).join(''))/100),
            quantity: Math.round(Math.random() * 1000),
            sold: Math.round(Math.random() * 100),
            thumb: product?.thumb,
            images: product?.images,
            brand: brandInDb._id,
            category: productCategoryInDb._id
        });
    
        if(productInDb) {
            productInDb.slug = slugify(`${productInDb.title} ${productInDb._id}`);
            console.log(`slug: ${productInDb.slug} \n`);
            if(product.variants.length > 0) {
                for(let variant of product.variants) {
                    productInDb.attributes.push({
                        label: variant?.label,
                        value: variant?.variants.length > 0 ? variant.variants[0] : "NULL",
                    });
                }
            }
        }
    
        await productInDb.save();
    } catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
    }
    
}

/**
 * Controller insert các sản phẩm
 * Author: PMChien (27/07/2024)
 */
const insertProduct = asyncHandler(async (req, res ) => {
    let promises = [];
    for( let product of products) {
        promises.push(await promiseInsertProduct(product));
    }
    await Promise.all(promises);
    return res.json("Done");
});

/**
 * Thêm một brand vào DB
 * @param {*} brandTitle tên của brand
 * Author: PMChien (28/07/2024)
 */
const promiseInsertBrand = async (brandTitle) => {
    try {
        let brandInDb = await Brand.create({
            title: brandTitle
        });
        //

        return brandInDb;
    } catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
        throw error;
    }
}

const promiseInsertBrandWithProductCategory = async (brandObj) => {
    try{
        const { brand, categories } = brandObj;
        let productCategory = new Set();
        for(let pcTitle of categories) {
            let pc = await ProductCategory.findOne({ title: pcTitle });
            if(pc) {
                productCategory.add(pc._id);
            }
        }
        let brandInDb = await Brand.create({ title: brand, category: Array.from(productCategory)});
        return brandInDb;
    }
    catch (e) {
        console.error(`Đã xảy ra lỗi tại hàm promiseInsertBrandWithProductCategory ${e}`);
    }
}

/**
 * Controller thêm một brand với brandTitle
 * Author: PMChien (28/07/2024)
 */
const insertBrand = asyncHandler(async (req, res) => {
    let promises = [];
    // for(let brandTitle of brands) {
    //     promises.push(promiseInsertBrand(brandTitle));
    // }
    for(let item of brandsWithPC) {
        promises.push(promiseInsertBrandWithProductCategory(item));
    }
    await Promise.all(promises);
    return res.json("Done");
});

/**
 * Thêm một product category vào db
 * @param {*} item một object chứa thông tin của category : { category, brands }
 * @returns Promise chứa productCategory hoặc error nếu lỗi
 * Author: PMChien (28/07/2024)
 */
const promiseInsertCategory = async (item) => {
    try {
        let categoryInDb = await ProductCategory.create({
            title: item.category
        });
        if(categoryInDb) {
            let brands = await Brand.find({ title: { $in: item.brand}});
            for(let brand of brands) {
                categoryInDb.brands.push(brand._id);
            }
            await categoryInDb.save();
        }
        return categoryInDb;
    } catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
        throw error;
    }
}

/**
 * Controller thêm các product category vào db
 * Author : PMChien (28/07/2024)
 */
const insertProductCategory = asyncHandler( async (req, res) => {
    let promises = [];
    for(let item of categories) {
        promises.push(promiseInsertCategory(item));
    }
    await Promise.all(promises);
    return res.json("Done");
});

module.exports = {
    insertProduct,
    insertBrand,
    insertProductCategory
}