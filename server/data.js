const products = require("./data/product.detail.json");
const categoryAndBrand = require("./data/category.json");
const fs = require('fs');

/**
 * Ghi file category và brand
 * @param {Array} products mảng productDetail
 * Author: PMChien (26/07/2024)
 */
const getCategory = (products) => {
    try {
        let categoryBrandMap = {};

        for(let product of products) {
            let cate = product.category[1];
            if(cate) {
                if(!categoryBrandMap[cate]) {
                    categoryBrandMap[cate] = new Set();
                }
                categoryBrandMap[cate].add(product.brand);
            }
        }

        let result = Object.keys(categoryBrandMap).map(cate => {
            return {
                category: cate,
                brand: Array.from(categoryBrandMap[cate])
            }
        });

        fs.writeFile('category.json', JSON.stringify(result), (err) => {
            if(err) {
                console.error(`Ghi file thất bại ${err}`);
            }
            else {
                console.log("Ghi file thành công");
            }
        })
    }
    catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
    }
}

const getBrand = (categoryAndBrand) => {
    let brand = new Set();
    for(let cateBrand of categoryAndBrand ) {
        for(let brandItem of cateBrand.brand) {
            brand.add(brandItem);
        }
    }
    let result = Array.from(brand);
    fs.writeFile('brand.json', JSON.stringify(result), (err) => {
        if(err) {
            console.error(`Ghi file thất bại ${err}`);
        }
        else {
            console.log("Ghi file thành công");
        }
    });
}

const writeBrandContainProductCategories = (categoryAndBrand) => {
    try {
        let brandContainProductCategories = {};
        for(let cateBrand of categoryAndBrand) {
            for(let brand of cateBrand.brand) {
                if(!brandContainProductCategories[brand]) {
                    brandContainProductCategories[brand] = new Set();
                }
            }
        }

        console.log(brandContainProductCategories);
        
        for(let cateBrand of categoryAndBrand) {
            for(let brand of cateBrand.brand) {
                brandContainProductCategories[brand].add(cateBrand.category);
            }
        }

        let result = Object.keys(brandContainProductCategories).map(brand => {
            return {
                brand: brand,
                categories: Array.from(brandContainProductCategories[brand])
            }
        })

        fs.writeFile('brandWithCategory.json', JSON.stringify(result), (err) => {
            if(err) {
                console.error(`Ghi file thất bại ${err}`);
            }
            else {
                console.log('Ghi file thành công')
            }
        });
        
    } catch (error) {
        console.error(`Đã xảy ra lỗi: ${error}`);
    }
}

//getCategory(products);
//getBrand(categoryAndBrand);
writeBrandContainProductCategories(categoryAndBrand);