require('dotenv').config()

const REQUIRED = ['NODE_ENV', 'PORT', 'MONGODB_URI']
const missing = REQUIRED.filter((key) => !process.env[key])

if(missing.length > 0) {
    console.log(`Missing required environmental variable(s): ${missing.join(', ')}`)
    process.exit(1)
}

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    isProduction: process.env.NODE_ENV === 'production'
}