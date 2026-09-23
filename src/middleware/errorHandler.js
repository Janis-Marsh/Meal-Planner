export function errorHandler(err, req, res, next) {
    const status = err.status ?? 500
    if(status >= 500) 
        console.error(err)
    res.status(status).json({
        error: {
            code:err.code ?? 'INTERNAL',
            message:status >= 500 ? 'Something went wrong SMH What did you do': err.message
        }
    })
}