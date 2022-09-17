module.exports =  (err, req, res, next) => {
    if(err.errorCode === "E0000001"){
        handleDuplicateKeyError(err, res);
        return next();
    }
}

const handleDuplicateKeyError = (err, res) => {
    if(err.errorSummary === "Api validation failed: login"){
        res.status(409).json({ 
                        field : "login", 
                        message: `this user already exists in pesto matrimony.`
                })
    }else if(err.errorSummary === "Api validation failed: password"){
        res.status(409).json({ 
            field : "password",  
            message: `this user already exists in pesto matrimony.`
    })
    }
 }
