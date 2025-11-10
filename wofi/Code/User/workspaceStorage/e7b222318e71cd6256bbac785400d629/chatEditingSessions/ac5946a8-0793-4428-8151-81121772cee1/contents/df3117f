export enum SleepQuality {
  POOR = "POOR",
  AVERAGE = "AVERAGE",
  GOOD = "GOOD",
  EXCEPTIONAL = "EXCEPTIONAL"
}

export interface HealthData {
  employee_id: string; // UUID
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: SleepQuality;
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string; // ISO date-time
}

export interface SSEHealthDataEvent {
  type: "connected" | "health-update" | "error";
  message?: string;
  data?: HealthData;
}
