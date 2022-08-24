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
                time:data[0].time,
                date:data[0].date,
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

exports.SearchAppWithDate = (req, res) =>{
    const date = req.param.date

    Appointment.find({ date: date })
    .then(data => {
        let appointment = {
            patName: data[0].patName,
            phoneNumber:data[0].phoneNumber,
            time:data[0].time,
            date:data[0].date,
        };
        res.send(appointment)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving appointments."
        })
    })
}