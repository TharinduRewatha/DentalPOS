const dbConfig = require("../Config/db.config.js")

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url


// db.item = require("./item.model.js")(mongoose)
// db.brand = require("./brand.model")(mongoose)
// db.stock = require("./stock.model.js")(mongoose)
// db.category = require("./category.model")(mongoose)
// db.branch = require("./branch.model")(mongoose)
// db.tag = require("./tag.model")(mongoose)
// db.uplog = require("./uplog.model")(mongoose)
// db.stockLog = require("./stockLog.model")(mongoose)
// db.exchange = require("./exchange.model")(mongoose)
// db.invoice = require("./invoice.model")(mongoose)
// db.purchase = require("./purchase.model")(mongoose)

//db.user = require("./user.model")(mongoose)
db.role = require("./role.model")(mongoose)

db.ROLES = ["frontdest", "admin", "doctor"];

module.exports = db