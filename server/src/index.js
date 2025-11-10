import app from "./app.js";
import {pool} from "./db/db.js";
import dotenv from "dotenv";
dotenv.config();


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});