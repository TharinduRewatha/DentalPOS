const dbConfig = require("../Config/db.config.js")

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url

db.role = require("./role.model")(mongoose)

db.ROLES = ["frontdest", "admin", "doctor"];

module.exports = db