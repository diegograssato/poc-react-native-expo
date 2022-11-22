import { PositionModel } from "../../infrastructure/repository/models/PositionModel";
import { Position } from "../position/Position";
import { Repo } from "./Repo";


export interface LocationTrackingRepository {
  tracking(key: string, formData: string): Promise<any>
}
