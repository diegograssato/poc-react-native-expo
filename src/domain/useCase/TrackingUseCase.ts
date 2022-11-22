export interface TrackingUseCase {
  config(): Promise<any>;
  define(): Promise<any>;
  startTracking(): Promise<void>;
  stopTracking(): Promise<void>;
}
