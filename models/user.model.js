const db = require("../utils/db");

module.exports = {
  all() {
    return db("users");
  },
  getUserByUserName(username) {
    return db("users").where("username", username).first();
  },
  getUserById(ID) {
    return db("users").where("id", ID).first();
  },
  getUserIdByEmail(Email) {
    return db("users").where("email", Email).first();
  },
  getUserByEmail(email) {
    return db("users").where("email", email).first();
  },
  getIdByUIdAndProvider(uid, provider) {
    return db("linkedusers").where({
      "uId": uid,
      "Provider":  provider
    }).first();
  },
  addLinkedUser(new_linkedUser) {
    return db("linkedusers").insert(new_linkedUser);
  },
  addUser(new_user) {
    return db("users").insert(new_user);
  },
  
};
