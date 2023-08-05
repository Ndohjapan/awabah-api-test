const AdminRepository = require("../database/repository/admin-repository");
const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");

class AdminService {
  constructor() {
    this.repository = new AdminRepository();
  }

  async FindByEmail(email) {
    try {
      const admin = await this.repository.FindAdminByEmail({email});
      return admin;
    } catch (error) {
      throw new NotFoundException(en["admin-not-found"]);
    }
  }

  async FindById(id) {
    try {
      const user = await this.repository.FindAdminById(id);

      return user;
    } catch (error) {
      throw new NotFoundException(en["admin-not-found"]);
    }
  }

  async FindAll() {
    try {
      const user = await this.repository.FindAll();

      return user;
    } catch (error) {
      throw new NotFoundException(en["admin-not-found"]);
    }
  }

  async UpdateOne(id, data) {
    let updateData = {};

    data.password = "";

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const user = await this.repository.UpdateOne({ id, updateData });

      return user;
    } catch (error) {
      throw new NotFoundException(en["admin-update-error"]);
    }
  }

  async FilterAdmins({ data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const users = await this.repository.FilterAdmins({
        data: updateData,
      });
      return users;
    } catch (error) {
      throw new NotFoundException(en["admin-not-found"]);
    }
  }
}

module.exports = { AdminService };
