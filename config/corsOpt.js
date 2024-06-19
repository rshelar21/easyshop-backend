const allowedOrigins = [
    'http://localhost:3000',
    'https://easyshop-eta.vercel.app',
    'https://easyshop-backend-ofyo.onrender.com'
]
// this is the list of allowed origins only these origins can access the resources

const corsOpt = {
    origin : (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
            // this is successfull hence we pass null and true
        }
        else {
            callback(new Error("not allowed by CORS"))
        }
    },
    credentials : true,
    optionsSuccessStatus : 200

}


module.exports = corsOpt