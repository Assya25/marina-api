require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const catwaySchema = new mongoose.Schema({
    catwayNumber: Number, 
    catwayType: String, 
    CatwayState: String, 
});

const reservationSchema = new mongoose.Schema ({
    catwayNumber : Number, 
    clientName : String, 
    boatName : String, 
    startDate : Date, 
    endDate : Date, 
})

const Catway = mongoose.model("Catway", catwaySchema);
const Reservation = mongoose.model ("Reservation", reservationSchema);

async function importData() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connecté");

        const catwaysPath = path.join(__dirname, "..", "data","catways.json");
        const reservationsPath = path.join(__dirname,".." , "data", "reservations.json");

        const catways = JSON.parse(fs.readFileSync(catwaysPath, "utf-8"))
        const reservations = JSON.parse(fs.readFileSync(reservationsPath, "utf8"));

        await Catway.deleteMany({});
        await Reservation.deleteMany({});

        await Catway.insertMany(catways);
        await Reservation.insertMany(reservations);

        console.log("import terminé avec succès");
        process.exit();
    } catch (error) {
        console.error("Erreur pendant l'import :", error);
        process.exit(1);
        }
    }

    importData();