module.exports = {
    getJsonResponse : (statusCode, errorText, data, res) => {
        res.json({
            statusCode  : statusCode,
            errorText   : errorText,
            data        : data,
        });
    },
    // getErrors: (res, err) => {
    //     return module.exports.getJsonResponse('error',400, err.array().filter(function(item) {
    //         delete item.value;
    //         delete item.location;
    //         delete item.param;
    //         return item;
    //     })[0].msg, {}, res);
    // },
};
