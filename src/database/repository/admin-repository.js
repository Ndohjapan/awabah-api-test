const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Admin } = require("../model");

class AdminRepository {
  async CreateAdmin({ name, email, password }) {
    try {
      await Admin.create({ name, email, password });
      return true;
    } catch (error) {
      throw new internalException(en["admin-creation-error"]);
    }
  }

  async FindAdminByEmail({ email }) {
    try {
      const existingAdmin = await Admin.findOne(
        { email },
        { createAt: 0, updatedAt: 0 },
      );

      return existingAdmin;
    } catch (err) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindAdminById(id) {
    try {
      const admin = await Admin.findById(id, { password: 0 });

      if (!admin) throw new Error();

      return admin;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async FindAll() {
    try {
      const admins = await Admin.find({}, { password: 0 }).sort({createAt: -1});
      if (!admins) throw new Error();
      return admins;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async UpdateOne({ id, updateData }) {
    try {
      const admin = await Admin.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        select: "-password",
      });

      return admin;
    } catch (error) {
      throw new internalException(en.admin_server_error);
    }
  }

  async FilterAdmins({ data }) {
    try {
      const admins = await Admin.find(data, { password: 0 }).sort({createAt: -1});
      if (!admins) throw new Error();
      return admins;
    } catch (error) {
      throw new internalException(en["server-error"]);
    }
  }

  async validatePassword({ admin, password }) {
    return await admin.validatePassword(password);
  }
}

module.exports = AdminRepository;
