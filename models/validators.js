var validate = require('mongoose-validator');



exports.identificators = [

    validate({
        validator: "isLength",
        arguments: [3, 250],
        message: "Idnetificator should be between {ARGS[0]} and {ARGS[1]} characters."
    })
];

exports.integerUnsigned = [

    validate({
        validator: "isInt",
        arguments: {min: 0},
        passIfEmpty: true,
        message: "Should be an integer unsigned."
    })
];

exports.messageStatus = [

    validate({
        validator: "isIn",
        arguments: [['scheduled', 'pending', 'processing', 'processed']],
        valid: ['scheduled', 'pending', 'processing', 'processed'],
        message: "Incorrect message status."
    })
];

exports.description = [

    validate({
        validator: "isLength",
        arguments: [3, 250],
        message: "Description should be between {ARGS[0]} and {ARGS[1]} characters."
    })
];



exports.float = [

    validate({
        validator: "isFloat",
        arguments: {min: 0},
        passIfEmpty: false,
        message: "Float value ."
    })
];


exports.data64 = [
    validate({
        validator: "isBase64",
        passIfEmpty: false,
        message: "Data  number must be base64 encoded."
    })
];

exports.hexadecimal = [
    validate({
        validator: "isHexadecimal",
        passIfEmpty: false,
        message: "Field must be in hexadecimal."
    })
];