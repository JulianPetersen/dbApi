require ('dotenv').config();

export default {
    SECRET: 'delivery-admin',
    host: process.env.APP_HOST,
    port: process.env.APP_PORT
}


