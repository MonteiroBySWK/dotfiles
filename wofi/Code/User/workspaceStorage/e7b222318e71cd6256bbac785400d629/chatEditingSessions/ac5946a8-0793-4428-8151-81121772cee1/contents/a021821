import type { NextRequest } from "next/server";
import { validateToken } from "@/middleware/auth";
import { HealthData, SleepQuality, SSEHealthDataEvent } from "@/types/health-data";
import { v4 as uuidv4 } from "uuid";

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>();

// Simulated real-time health data generator with all required fields
function generateHealthData(employeeId: string): HealthData {
  const baseHeartRate = 70 + Math.random() * 20; // 70-90 BPM base
  const variation = Math.sin(Date.now() / 10000) * 10; // Sine wave variation
  const randomNoise = (Math.random() - 0.5) * 5; // Random noise

  // Required fields
  const data: HealthData = {
    healthdata_id: uuidv4(), // Gerar UUID único para cada leitura
    employee_id: employeeId,
    bpm: Math.round(baseHeartRate + variation + randomNoise),
    timestamp: new Date().toISOString(),
  };

  // Opcional: Adicionar campos não obrigatórios com 70% de chance
  if (Math.random() > 0.3) {
    data.spo2 = Math.round(96 + Math.random() * 3); // 96-99%
  }
  if (Math.random() > 0.3) {
    data.ecgSignal = "NORMAL"; // Simplified ECG signal
  }
  if (Math.random() > 0.3) {
    data.sleepDuration = Math.round(6 + Math.random() * 4); // 6-10 hours
    data.sleepQuality = [SleepQuality.POOR, SleepQuality.AVERAGE, SleepQuality.GOOD, SleepQuality.EXCEPTIONAL][
      Math.floor(Math.random() * 4)
    ];
  }
  if (Math.random() > 0.3) {
    data.stressLevel = Math.round(20 + Math.random() * 40); // 20-60
  }
  if (Math.random() > 0.3) {
    data.steps = Math.round(1000 + Math.random() * 9000); // 1000-10000 steps
    data.distanceM = Number((500 + Math.random() * 4500).toFixed(2)); // 500-5000 meters
    data.calories = Number((1000 + Math.random() * 1000).toFixed(2)); // 1000-2000 calories
  }
  if (Math.random() > 0.3) {
    data.bpSystolic = Math.round(110 + Math.random() * 30); // 110-140 mmHg
    data.bpDiastolic = Math.round(70 + Math.random() * 20); // 70-90 mmHg
  }
  if (Math.random() > 0.3) {
    data.skinTemp = Number((36.0 + Math.random() * 1.5).toFixed(1)); // 36.0-37.5°C
  }

  return data;
}

export async function GET(request: NextRequest) {
  // Validate JWT token
  const authError = await validateToken(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId") || "all";

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const connectionId = `${employeeId}-${Date.now()}`;
      connections.set(connectionId, controller);

      // Send initial connection message
      const initialEvent: SSEHealthDataEvent = {
        type: "connected",
        message: "SSE connection established",
      };

      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(initialEvent)}\n\n`));

      // Send periodic health data updates
      const interval = setInterval(() => {
        try {
          if (employeeId === "all") {
            // Generate UUIDs for demonstration - in production these should come from your database
            const employeeIds = Array(4).fill(0).map(() => uuidv4());
            
            employeeIds.forEach((empId) => {
              const healthData = generateHealthData(empId);
              const event: SSEHealthDataEvent = {
                type: "health-update",
                data: healthData,
              };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
            });
          } else {
            const healthData = generateHealthData(employeeId);
            const event: SSEHealthDataEvent = {
              type: "health-update",
              data: healthData,
            };
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
          }
        } catch (error) {
          console.error("Error sending SSE data:", error);
          clearInterval(interval);
          connections.delete(connectionId);
          controller.close();
        }
      }, 2000); // Update every 2 seconds

      // Handle connection cleanup
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        connections.delete(connectionId);
        controller.close();
      });

      // Cleanup after 5 minutes to prevent memory leaks
      setTimeout(() => {
        clearInterval(interval);
        connections.delete(connectionId);
        try {
          controller.close();
        } catch (error) {
          // Connection might already be closed
        }
      }, 300000); // 5 minutes
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control, Authorization",
    },
  });
}
