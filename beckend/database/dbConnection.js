import mongoose from 'mongoose'

let isConnected = false

async function dbConnection() {

    if (isConnected) return

    try {

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "mk",
            serverSelectionTimeoutMS: 8000
        })

        isConnected = true
        console.log("The db is runnig")

    } catch (error) {

        console.log(error, "The error from db connection")

    }

}

export default dbConnection