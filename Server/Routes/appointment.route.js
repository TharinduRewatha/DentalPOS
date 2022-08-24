module.exports = (app) => {
    const appointment = require("../Controllers/appointment.controller")

    var router = require("express").Router()

    router.post("/",appointment.create)

    router.delete("/:aId", appointment.DeleteFromAppointmentId)

    router.put("/:aId", appointment.update)

    router.get("/", appointment.findAllActive)

    router.get("/all", appointment.findAll)

    router.get("/namebyid/:appId", appointment.AppointmentFromId)

    router.get("/name/:patName", appointment.findByName)

    app.use("/api/appointment", router)
};