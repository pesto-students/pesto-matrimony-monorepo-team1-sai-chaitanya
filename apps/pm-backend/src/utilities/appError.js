//class for global error handling middleware 
//this file by V

class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode; //statusCode = 404 or 500
        //startsWith is a fun checking first cherchter. 
        this.status = `$(statusCode)`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; //this class send message to client only for operational error
        
        //stackTrace showing the stack of errors and where it happened
        //it is to stop showing stack of error to client 
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;