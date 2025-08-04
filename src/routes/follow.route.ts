import { Router } from "express";
import { param } from "express-validator";
import validate from "../middlewares/validate";
import authcheck from "../middlewares/authcheck";
import { followUser } from "../controllers/follow.controller";

const followRouter = Router();


followRouter.post("/:follow_id"
    , param("follow_id").isMongoId().withMessage("User ID not Valid")
    , validate
    , authcheck
    , followUser
);




export default followRouter;