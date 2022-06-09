import sql from "mssql";
import config from "../config";

const dbSettings = {
    user: 'sa',
    password: config.ServerPassword,
    server: 'localhost\\MSSQL1',
    database: 'NorthAmerica',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

export async function getConnection(){
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.log(error);
    }
};