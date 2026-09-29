function errorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                message: err.message
            }
        })
    }

    const status = err.statusCode || 500

    if (status >= 500) {
        console.error(err)
    }

    res.status(status).json({
        success: false,
        error: {
            message: status >= 500
                ? 'Internal Server Error'
                : err.message
        }
    })
}

module.exports = errorHandler