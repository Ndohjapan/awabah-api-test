const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const CategoryRepository = require("../database/repository/category-repository");

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async CreateCategory(data) {
    try {
      const category = await this.repository.CreateCategory(data);

      return category;
    } catch (error) {
      throw new CreationException(en["category-creation-error"], 401);
    }
  }

  async FindById(id) {
    try {
      const category = await this.repository.FindCategoryById(id);

      return category;
    } catch (error) {
      throw new NotFoundException(en["category-find-error"]);
    }
  }

  async FindAll() {
    try {
      const category = await this.repository.FindAll();

      return category;
    } catch (error) {
      throw new NotFoundException(en["category-find-error"]);
    }
  }

  async DeleteCategory(id) {
    try {
      const isCategory = await this.repository.FindCategoryById(id);
      if (isCategory.id) {
        const category = await this.repository.DeleteCategory(id);

        return category;
      }
      throw new Error(en["category-find-error"]);
    } catch (error) {
      throw new NotFoundException(error.category || en["category-delete-error"]);
    }
  }

  async UpdateOne(id, data){
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });
    
    try {
      const category = await this.repository.UpdateOne({id, updateData});
    
      return category;
        
    } catch (error) {
      throw new NotFoundException(en["category-find-error"]);      
    }    
  }
}

module.exports = { CategoryService };