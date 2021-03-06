var models = require('../models/models');
var outputAdapter = require('../models/outputAdapter');
var uuid = require('node-uuid');


exports.queuePull = function (req, res, next) {

    var node_id_header = req.app.get('config')['headers']['node_source'];
    models.message
        .findOneAndUpdate(
            {
                node_destination: req.get(node_id_header),
                $or: [{status: "pending"}, {status: "scheduled", scheduled_time: {$lte: Date.now()}}]
            },
            {
                status: "processing",
                processing_time: new Date(),
                $inc: {"tries": 1}
            },
            {new: true})
        .sort({create_time: -1})
        .exec(function (err, result) {
            if (err) {
                next(err);
            }
            if (!result) {
                res.status(204);
                res.end();
            } else {
                outputAdapter.output(res, result);
            }
        });

};

exports.queuePush = function (req, res, next) {

    var input_data = {};
    var headers = req.app.get('config')['headers'];

    input_data['node_destination'] = req.get(headers['node_destination']) || null;
    input_data['node_source'] = req.get(headers['node_source']) || null;
    input_data['status'] = req.get(headers['status']) || null;
    input_data['scheduled_time'] = req.get(headers['scheduled_time']) || null;
    input_data['payload_type'] = req.get(headers['payload_type']) || req.get('Content-Type');
    input_data['payload'] = req.body;

    if (input_data['status'] == 'scheduled' && !req.get(headers['scheduled_time'])) {
        res.status(400);
        res.json({"message": "An scheduled message requires the scheduled time header to be set."});
    } else {
        var message = new models.message(input_data);
        message.save(function (err, result) {
            if (err) {
                next(err);
            } else {
                res.header('Location', '/messages/' + result._id);
                res.status(201);
                outputAdapter.output(res, result)
            }
        });
    }
};


exports.ack = function (req, res, next) {

    var node_id_header = req.app.get('config')['headers']['node_source'];

    models.message.findOneAndUpdate({
            _id: req.params.message_id, node_destination: req.get(node_id_header), status: "processing"
        },
        {status: "processed", processed_time: new Date()},
        {runValidators: true, multi: false, upsert: false, new: true},
        function (err, result) {

            if (err) {
                next(err);
            } else {
                if (result != null) {
                    outputAdapter.output(res, result);
                } else {
                    res.status(404);
                    res.json({"message": "Resource not found."})
                }
            }
        });
};

