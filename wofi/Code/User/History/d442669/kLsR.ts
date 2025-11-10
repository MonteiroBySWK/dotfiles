export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'data_analyst' | 'system_manager';
}

export interface CreatedUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  tokenJWT: string;
}

export interface RegisterHealthDataDTO {
  employee_id: string;
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCEPTIONAL';
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string;
}

export interface CreatedHealthDataDTO {
  healthdata_id: string;
  employee_id: string;
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCEPTIONAL';
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string;
}

export interface RegisterEmployeeDTO {
  user_id: string;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
}

export interface CreatedEmployeeDTO {
  id: string;
  user_id: string;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
}

export interface ReadUserDTO {
  id: string;
  name: string;
  email: string;
  userRole: 'EMPLOYEE' | 'DATA_ANALYST' | 'SYSTEM_MANAGER';
  active: boolean;
}

export interface ReadHealthDataDTO {
  healthdata_id: string;
  employee_id: string;
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCEPTIONAL';
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string;
}

export interface ReadEmployeeDTO {
  id: string;
  user: ReadUserDTO;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
  healthCarePages: ReadHealthDataDTO[];
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  offset: number;
  sort: SortObject;
}

export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageReadUserDTO {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  size: number;
  content: ReadUserDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  empty: boolean;
}

export interface PageReadEmployeeDTO {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  size: number;
  content: ReadEmployeeDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  empty: boolean;
}
