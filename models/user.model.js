const db = require("../utils/db");
const { del } = require("./tag.model");

module.exports = {
    all() {
        return db("users")
            .orderBy("Permission", "desc");
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
            "Provider": provider
        }).first();
    },
    addLinkedUser(new_linkedUser) {
        return db("linkedusers").insert(new_linkedUser);
    },
    addUser(new_user) {
        return db("users").insert(new_user);
    },
    updatePremium(id, time) {
        return db("users")
            .where("id", id)
            .update({
                premium: time,
            });
    },
    async updatePassword(id, new_password) {
        return db("users")
            .where("id", id)
            .update({
                password: new_password,
            });
    },
    patch(new_user) {
        const ID = new_user.id;
        delete new_user.id;
        return db('users')
            .where('id', ID)
            .update(new_user)
    },
    del(userID) {
        return db("users").where("id", userID).del();
    }

};