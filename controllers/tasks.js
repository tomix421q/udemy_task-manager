const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async(req, res) => {

    const tasks = await Task.find({})
    res.status(200).json({ tasks })



})

const createTask = async(req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error })
    }

}

const getTask = asyncWrapper(async(req, res, next) => {
    const { id: taskID } = req.params
    const task = await Task.findOne({ _id: taskID })
    if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404))
    }

    res.status(200).json({ task })
})

const deleteTask = async(req, res) => {
    try {
        const { id: taskID } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskID })
        if (!task) {
            return res.status(404).json({ msg: `No task with id: ${taskID}` })
        }
        res.status(200).json({ task });
        // res.status(200).json({ task: null, status: 'success' })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const updateTask = async(req, res) => {
    try {
        const { id: taskID } = req.params;

        const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).json({ msg: `No task with id: ${taskID}` })
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask }