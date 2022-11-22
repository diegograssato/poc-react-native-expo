export class PositionModel {
  accuracy: number
  altitude:number
  altitudeAccuracy: number
  heading: number
  latitude: number
  longitude:number
  speed: number
  gps_date_time: number

  constructor(accuracy: number,
  altitude:number,
  altitudeAccuracy: number,
  heading: number,
  latitude: number,
  longitude:number,
  speed: number,
  gps_date_time: number) {
    this.accuracy = accuracy
    this.altitude = altitude
    this.altitudeAccuracy = altitudeAccuracy
    this.heading = heading
    this.latitude = latitude
    this.longitude = longitude
    this.speed = speed
    this.gps_date_time = gps_date_time
  }

   public toEncodeURI(): string {
    
    const formBody = Object.entries(this).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')
    return formBody;
  }
}
