import { resolve } from "path";
import { ConfigUtil } from "../utils/config.util";
import { CONFIG } from "./configs";

ConfigUtil.parse(resolve(__dirname, "../../config.ini"));

export = CONFIG.TYPEORM;