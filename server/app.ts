import express from "express";

const app = express();

// Defaults
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.set('trust proxy', 1);



export { app }