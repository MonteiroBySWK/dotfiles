export enum SleepQuality {
  POOR = "POOR",
  AVERAGE = "AVERAGE",
  GOOD = "GOOD",
  EXCEPTIONAL = "EXCEPTIONAL"
}

export interface HealthData {
  healthdata_id: string;  // UUID
  employee_id: string;    // UUID
  bpm: number;           // Required
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
  timestamp: string;     // Required - ISO date-time
}

export interface SSEHealthDataEvent {
  type: "connected" | "health-update" | "error";
  message?: string;
  data?: HealthData;
}
