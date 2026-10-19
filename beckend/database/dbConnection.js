import mongoose from 'mongoose'

async function dbConnection() {

    try {

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "mk"
        })

        console.log("The db is runnig");

    } catch (error) {

        console.log(error, "The error from db connection");

    }

}

export default dbConnection