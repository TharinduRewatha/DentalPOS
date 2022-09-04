const db = require("../Models")
const Appointment = db.appointment
const axios = require('axios')


const dbLinks = require("../config/db.config")
const { appointment } = require("../Models")

require('dotenv').config();

exports.create = (req, res) => {
    const appointment = new Appointment({
        patName: req.body.patName,
        phoneNumber: req.body.phoneNumber,
        date: req.body.date,
        time: req.body.time,
        appId : req.body.appId,
        nic : req.body.nic,
        address : req.body.address,
        treatment : req.body.treatment,
        amount : req.body.amount,
        attended : false,
        doctor : req.body.doctor,
        _active: true

    })
    appointment
        .save(appointment)
        .then(appData => {
            //SMS API
            res.send(appData)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Item."
            })
        })
}

exports.findByName = (req, res) => {

    const sfNameLast = req.params.patName.replace(/[^\w\s+]/gi, '')
    const sfName = sfNameLast.replace(/\s/g, "")

    var condition = sfName ? {
        sfName: { $regex: new RegExp(sfName), $options: "ix" },
        _active: true
    } : {}


    Appointment.find(condition)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving items."
            })
        })
}


exports.findAll = (req, res) => {
    Appointment.find()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving appointments."
            })
        })
}

exports.AppointmentFromId = (req, res) => {
    const appId = req.params.aId

    Appointment.find({ _id: appId })
        .then(data => {
            let appointment = {
                patName: data[0].patName,
                phoneNumber:data[0].phoneNumber,
                date:data[0].date,
                address:data[0].address,
                nic:data[0].nic,
                doctor:data[0].doctor,
                treatment:data[0].treatment,
                amount:data[0].amount,
                _active:data[0]._active,
            };
            res.send(appointment)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving appointments."
            })
        })
}

exports.findAllActive = (req, res) => {
    Appointment.find({ _active: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Appointments.",
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const appId = req.params.aId;

    Appointment.findOneAndUpdate({ _id: appId }, { $set: req.body })
    .then(data => {

    if (data) {
    res.send(true);

    } else 
        res.status(404).send({
            message: `Cannot update appointment with id=${appId}`,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: `Error updating appointment with id=${appId}`
         });
    });
};


exports.DeleteFromAppointmentId = (req, res) => {
    const Id = req.params.aId

    Appointment.findByIdAndUpdate({ _id: Id }, { $set: { _active: false } })
        .then(data => {

            if (data) {
                res.send(true)

            } else res.status(404).send({
                message: `Cannot delete appointment with id=${Id}. Maybe appointment was not found!`
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err
            })
        })
}


exports.SearchAppWithDate = (req, res) => {
    let appvar = {}
    let appDet = []
    var dateTimeAfter = new Date(req.params.dateTimeAfter)
    dateTimeAfter.setDate(dateTimeAfter.getDate() + 1)
    console.log(dateTimeAfter)
    Appointment.find({
            dateTime: {
                $gte: req.params.dateTimeBefore,
                $lt: dateTimeAfter,

            },
            _active: true
        })
        .then((data) => {
            data.forEach(app => {
                appvar = {
                    patName: app.patName,
                    phoneNumber:app.phoneNumber,
                    date:app.date,
                    address:app.address,
                    nic:app.nic,
                    doctor:app.doctor,
                    treatment:app.treatment,
                    amount:app.amount,
                    _active:app._active,
                }
                appDet.push(appvar)
            })
            res.send(appDet)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving appointments.",
            })
        })
}


exports.updateTheAttendedStatus = (req, res) => {

    const appId = req.params.aId;

    Appointment.findOneAndUpdate({ _id: appId },{ $set: { attended: true } })
    .then(data => {

    if (data) {
    res.send(true);

    } else 
        res.status(404).send({
            message: `Cannot update appointment with id=${appId}`,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: `Error updating appointment with id=${appId}`
         });
    });
};

exports.findAllAttended = (req, res) => {
    Appointment.find({ attended: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Appointments.",
            });
        });
};

exports.updateAmountById = (req, res) => {
    const id = req.params.iId
    const amount = req.params.amount

    Appointment.findOneAndUpdate({ _id: id }, { $set: { amount: amount } })
        .then(data => {

            if (data) {
                res.send(true);

            } else res.status(404).send({
                message: `Cannot update apointmnet with price=${price}. Maybe apointmnet was not found!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating apointmnet with price=" + price
            })
        })
}

