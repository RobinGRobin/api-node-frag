import {config} from 'dotenv'
config();

export default {
    port: process.env.PORT,
    ServerPassword: process.env.SPASS
}