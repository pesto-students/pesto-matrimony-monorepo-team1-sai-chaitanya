//global error handller is being exported 
//this file is by V

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    //console.log(value);
    const message = `Duplicate field value: ${value}. please use another value`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid Input Data ${errors.join('. ')}`;
    return new AppError(message, 400);
};

//handling invalid token error from 'authController' file 'protect' function, this fun() is calling below
const handleJWTError = () => new AppError('Invalid Token Please login again', 401);

const hnadleJWTExpiredError = () => new AppError('Your Token has Expired! Please login again.', 401);


const sendErrorDev = (err, req, res) => {
    //A) API
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
        //B) rendered website 
        console.error('ERROR', err);
        return res.status(err.statusCode).render('error', {
            title: 'Somthing went wrong!',
            msg: err.message
        });
    
};

const sendErrorProd = (err, req, res) => {
    //A) API
    if(req.originalUrl.startsWith('/api')){
     //A) Operational, trusted error: send message to client
     if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
    
        });
    }   
    
        //B) programming or other unknown error: don't leak error details
        //.1log error
        console.error('ERROR', err);

        //2.send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Somthing went very wrong'   
        });
    
    } 
        //B) rendered website 
        //A) Operational, trusted error: send message to client
        if(err.isOperational){
            return res.status(err.statusCode).render('error', {
                title: 'Somthing went wrong!',
                msg: err.message
            });
    
        
        }
        //B) programming or other unknown error: don't leak error details     
            //.1log error
            console.error('ERROR', err);
    
            //2.send genric message
            return res.status(err.statusCode).render('error', {
                title: 'Somthing went wrong!',
                msg: 'Please try again later'
            });
        
    
    
    
}

module.exports = (err, req, res, next) => {
    //console.log(err.stack);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res);

    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        error.message = err.message;

        //when calling a tour with wrong id, 'CastError' is error name        
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        //when creating duplicate tour, 11000 is error code 
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        //for validation error, 'ValidationError' is error name
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);

        //'JasonWebTokenError' this is error name
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        //'TokenExpiredError' this is error name
        if(error.name === 'TokenExpiredError') error = hnadleJWTExpiredError(); 

         sendErrorProd(error, req, res);


    }
};