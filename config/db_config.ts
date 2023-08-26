type DbConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
    connectTimeout: number;
}
    
    const dbConfig : DbConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "db_test2",
        connectTimeout: 60000
    }


    export default dbConfig