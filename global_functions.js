pe = require('parse-error');//parses error so you can read error message and handle them accordingly

to = function (promise) {//global function that will help use handle promise rejections, this article talks about it http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
    return promise
        .then(data => {
            return [null, data];
        }).catch(err =>
            [pe(err)]
        );
}


TE = function (err_message, log) { // TE stands for Throw Error
    if (log === true) {
        // console.error(err_message);
    }

    throw new Error(err_message);
}

ReE = function (res, err, code) { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    //return res.json({success:false, error: err});
    return res.json({ success: false, message: err });
}

ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};

removeEmpty = (obj) => {
    const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

    Object.keys(o).forEach(key => {
        if (o[key] && typeof o[key] === 'object')
            o[key] = removeEmpty(o[key]);  // Recurse.
        else if (o[key] === undefined || o[key] === null)
            delete o[key]; // Delete undefined and null.
        else
            o[key] = o[key];  // Copy value.
    });

    return o; // Return new object.
};

capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    // console.error('Uncaught Error', pe(error));
});

errorMessage = function (err) {
    if (err.errors && err.errors.length > 0) return err.errors[0].message;
    else if (err.message) return err.message;
    return err;
};
