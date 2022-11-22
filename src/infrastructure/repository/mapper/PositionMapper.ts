import { Position } from "../../../domain/position/Position";
import { PositionModel } from "../models/PositionModel";

export class PositionMapper {

  public static toPosition (position: Position): PositionModel {
    const model = new PositionModel(
      position.coords.accuracy, 
      position.coords.altitude,
      position.coords.altitudeAccuracy ,
      position.coords.heading,
      position.coords.latitude,
      position.coords.longitude,
      position.coords.speed,
      position.timestamp,
    );
    return model;
  }

}