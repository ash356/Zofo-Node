// Async Handler Method
// Handle Programming Errors
export const asyncHandler = (method) => {
    return (req, res, next) => {
        method(req, res, next).catch(error => {
            next(error);
        })
    }
}
// Global Error Handling Middleware ( with 4 Paramters )
// Handle Operation Errors
export const globalErrorHandler = (err, req, res, next) => {
    if (err) {
        // Check files 
        if (err.message == 'Unexpected field') {
            err.message = 'MaxCount 5 Files'
        }
        // Check DEV Mood
        if (process.env.MOOD == "DEV") {
            // console.log(err.cause);
            // Return on DEV Mood
            return res.status(err.cause || 500).json({
                message: err.message,
                code: err.cause || 500,
                // err,
                stack: err.stack
            })
        }
        // Return on Production Mood
        return res.status(err.cause || 500).json({
            message: err.message,
            code: err.cause || 500
        });
    }
}
// 01- uncaughtException
export const uncaughtException = () => {
    process.on('uncaughtException', error => {
        console.error("uncaughtException", error);

    })
}
// 02 - unhandledRejection
// Handle Errors Outside Express (Rejections)
export const unhandledRejection = () => {
    process.on('unhandledRejection', error => {
        console.error(unhandledRejection, error)
    })
}


