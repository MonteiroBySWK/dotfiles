import { ReadHealthDataDTO } from './api-client';

// Função para gerar um número aleatório dentro de um intervalo
const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Função para gerar um número decimal aleatório dentro de um intervalo
const randomFloatInRange = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

// Função para gerar dados de saúde aleatórios para um funcionário
export const generateHealthData = (employeeId: string): ReadHealthDataDTO => {
  const now = new Date();
  
  return {
    healthdata_id: `hd-${Math.random().toString(36).substr(2, 9)}`,
    employee_id: employeeId,
    bpm: randomInRange(60, 100), // Batimentos cardíacos normais
    spo2: randomInRange(95, 100), // SpO2 normal
    stressLevel: randomInRange(1, 5),
    steps: randomInRange(0, 1000), // Passos incrementais
    distanceM: randomFloatInRange(0, 1000), // Distância em metros
    calories: randomFloatInRange(0, 500), // Calorias queimadas
    bpSystolic: randomInRange(110, 130), // Pressão sistólica normal
    bpDiastolic: randomInRange(70, 85), // Pressão diastólica normal
    skinTemp: randomFloatInRange(35.5, 37.5), // Temperatura corporal normal
    sleepQuality: ["POOR", "AVERAGE", "GOOD", "EXCEPTIONAL"][randomInRange(0, 3)] as "POOR" | "AVERAGE" | "GOOD" | "EXCEPTIONAL",
    sleepDuration: randomInRange(0, 480), // Duração do sono em minutos (0-8 horas)
    timestamp: now.toISOString()
  };
};

// Classe para simular o SSE para um funcionário específico
export class MockHealthDataStream {
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((data: ReadHealthDataDTO) => void)[] = [];
  
  constructor(private employeeId: string, private interval: number = 5000) {}

  // Iniciar o stream de dados
  start() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      const newData = generateHealthData(this.employeeId);
      this.listeners.forEach(listener => listener(newData));
    }, this.interval);
  }

  // Parar o stream de dados
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Adicionar um listener para os dados
  onData(callback: (data: ReadHealthDataDTO) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

// Gerenciador de streams de dados simulados
export class MockHealthDataStreamManager {
  private streams: Map<string, MockHealthDataStream> = new Map();
  
  // Obter ou criar um stream para um funcionário
  getStream(employeeId: string): MockHealthDataStream {
    if (!this.streams.has(employeeId)) {
      const stream = new MockHealthDataStream(employeeId);
      this.streams.set(employeeId, stream);
    }
    return this.streams.get(employeeId)!;
  }

  // Parar todos os streams
  stopAll() {
    this.streams.forEach(stream => stream.stop());
    this.streams.clear();
  }
}

// Instância global do gerenciador de streams
export const mockHealthDataManager = new MockHealthDataStreamManager();

// Mock data for employees
export const mockEmployees = [
  {
    id: "emp-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Engineering",
    position: "Senior Developer",
    smartwatchId: "SW-1234",
    status: "Active",
  },
  {
    id: "emp-002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    smartwatchId: "SW-2345",
    status: "Active",
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "HR",
    position: "HR Specialist",
    smartwatchId: "SW-3456",
    status: "Active",
  },
  {
    id: "emp-004",
    name: "David Kim",
    email: "david.kim@company.com",
    department: "Finance",
    position: "Financial Analyst",
    smartwatchId: null,
    status: "Inactive",
  },
  {
    id: "emp-005",
    name: "Jessica Taylor",
    email: "jessica.taylor@company.com",
    department: "Engineering",
    position: "QA Engineer",
    smartwatchId: "SW-4567",
    status: "Active",
  },
]

// Mock data for smartwatches
export const mockSmartwatches = [
  {
    id: "SW-1234",
    model: "HealthTrack Pro",
    assignedTo: "Sarah Johnson",
    lastSync: "Today, 10:23 AM",
    battery: 85,
    status: "Online",
  },
  {
    id: "SW-2345",
    model: "HealthTrack Pro",
    assignedTo: "Michael Chen",
    lastSync: "Today, 9:45 AM",
    battery: 72,
    status: "Online",
  },
  {
    id: "SW-3456",
    model: "HealthTrack Lite",
    assignedTo: "Emily Rodriguez",
    lastSync: "Yesterday, 5:30 PM",
    battery: 45,
    status: "Offline",
  },
  {
    id: "SW-4567",
    model: "HealthTrack Pro",
    assignedTo: "Jessica Taylor",
    lastSync: "Today, 11:15 AM",
    battery: 92,
    status: "Online",
  },
  {
    id: "SW-5678",
    model: "HealthTrack Lite",
    assignedTo: null,
    lastSync: "3 days ago",
    battery: 20,
    status: "Low Battery",
  },
]

// Mock health data
export const mockHealthData = [
  {
    healthdata_id: "hd-001",
    employee_id: "emp-001",
    employeeName: "Sarah Johnson",
    bpm: 72,
    spo2: 98,
    ecgSignal: "normal",
    sleepDuration: 420, // 7 hours in minutes
    sleepQuality: "Deep",
    stressLevel: 25,
    steps: 9876,
    distanceM: 7540.5,
    calories: 345.2,
    bpSystolic: 120,
    bpDiastolic: 80,
    skinTemp: 36.5,
    timestamp: "2023-06-13T08:30:00",
  },
  {
    healthdata_id: "hd-002",
    employee_id: "emp-002",
    employeeName: "Michael Chen",
    bpm: 68,
    spo2: 97,
    ecgSignal: "normal",
    sleepDuration: 390, // 6.5 hours in minutes
    sleepQuality: "Light",
    stressLevel: 40,
    steps: 7532,
    distanceM: 5840.3,
    calories: 290.5,
    bpSystolic: 118,
    bpDiastolic: 78,
    skinTemp: 36.7,
    timestamp: "2023-06-13T09:15:00",
  },
  {
    healthdata_id: "hd-003",
    employee_id: "emp-003",
    employeeName: "Emily Rodriguez",
    bpm: 75,
    spo2: 99,
    ecgSignal: "normal",
    sleepDuration: 450, // 7.5 hours in minutes
    sleepQuality: "Deep",
    stressLevel: 20,
    steps: 10245,
    distanceM: 8120.7,
    calories: 380.1,
    bpSystolic: 115,
    bpDiastolic: 75,
    skinTemp: 36.4,
    timestamp: "2023-06-13T08:45:00",
  },
  {
    healthdata_id: "hd-004",
    employee_id: "emp-005",
    employeeName: "Jessica Taylor",
    bpm: 70,
    spo2: 96,
    ecgSignal: "normal",
    sleepDuration: 360, // 6 hours in minutes
    sleepQuality: "REM",
    stressLevel: 35,
    steps: 8765,
    distanceM: 6890.2,
    calories: 320.8,
    bpSystolic: 122,
    bpDiastolic: 82,
    skinTemp: 36.6,
    timestamp: "2023-06-13T09:30:00",
  },
  {
    healthdata_id: "hd-005",
    employee_id: "emp-001",
    employeeName: "Sarah Johnson",
    bpm: 74,
    spo2: 97,
    ecgSignal: "normal",
    sleepDuration: null,
    sleepQuality: null,
    stressLevel: 30,
    steps: 2345,
    distanceM: 1890.5,
    calories: 120.3,
    bpSystolic: 121,
    bpDiastolic: 81,
    skinTemp: 36.5,
    timestamp: "2023-06-13T12:30:00",
  },
]

// Mock recent activity
export const mockRecentActivity = [
  {
    id: "act-001",
    userName: "Sarah Johnson",
    userImage: "/placeholder.svg?height=32&width=32",
    action: "Recorded high stress level (65) at 2:30 PM",
    timestamp: "2 hours ago",
  },
  {
    id: "act-002",
    userName: "Michael Chen",
    userImage: "/placeholder.svg?height=32&width=32",
    action: "Completed daily step goal of 10,000 steps",
    timestamp: "3 hours ago",
  },
  {
    id: "act-003",
    userName: "Emily Rodriguez",
    userImage: "/placeholder.svg?height=32&width=32",
    action: "Recorded 8 hours of sleep with 90% quality",
    timestamp: "8 hours ago",
  },
  {
    id: "act-004",
    userName: "Jessica Taylor",
    userImage: "/placeholder.svg?height=32&width=32",
    action: "Heart rate elevated to 110 BPM during exercise",
    timestamp: "Yesterday",
  },
  {
    id: "act-005",
    userName: "Admin",
    userImage: "/placeholder.svg?height=32&width=32",
    action: "Added new employee: David Kim",
    timestamp: "2 days ago",
  },
]
