import Router from "express";
import {initialPage, employeeData, employeeDataFiltered} from "../controllers/controller";

const router = Router();

router.get("/", initialPage);
router.get("/employee-list", employeeData);
router.get("/employee-list/filter", employeeDataFiltered);

export default router;