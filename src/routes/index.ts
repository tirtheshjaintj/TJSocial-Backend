import { Router } from "express";
const homeRouter = Router();

homeRouter.get("/", (req, res) => {
    res.status(200).send("<h1>Working Fine</h1>");
});



export default homeRouter;

