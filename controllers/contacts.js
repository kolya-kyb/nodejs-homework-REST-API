const { ctrlWrapper } = require("../utils");

const { Contact } = require("../models/contacts")
const { HttpError } = require("../helpers");

const listContacts = async (req, res) => {
    const result = await Contact.find({}, "-createdAt -updatedAt");
    res.json(result);
}

const getById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await Contact.findById(id)
        res.json(result);
    } catch (err) {
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
            throw HttpError(404);
        }

    }
};

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const {id} = req.params;
    if (Object.keys(req.body).length === 0 || req.body === null || req.body === undefined) {

        throw HttpError(400);
    }
    try {
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(result);
    } catch (err) {
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
            throw HttpError(404);
        }
    }
}

const updateStatusContact = async (req, res) => {
    const {id} = req.params;

    if (Object.keys(req.body).length === 0 || req.body === null || req.body === undefined) {

        throw HttpError(400);
    }
    try {
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        res.json(result);
    } catch (err) {
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
            throw HttpError(404);
        }
    }
}
const removeContact = async (req, res) => {
    const { id } = req.params;
    try {
         await Contact.findByIdAndDelete(id);
    }
    catch (err) {
        if (err.message && ~err.message.indexOf('Cast to ObjectId failed')) {
            throw HttpError(404);
        }
    }

    res.json({
        message: "contact deleted"
    })
}

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    addContact: ctrlWrapper(addContact),
    getById: ctrlWrapper(getById),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact:ctrlWrapper(updateStatusContact),
    removeContact: ctrlWrapper(removeContact),
}