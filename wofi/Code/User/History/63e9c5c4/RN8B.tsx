import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

import MapView, { Polygon } from "react-native-maps";

import * as Haptics from "expo-haptics";

import { useAuth } from "@/hooks/useAuth";
import { Alert } from "react-native";
import { URL_API } from "./_layout";

type Zone = {
  zone_id: string;
  name: string;
  description: string;
  points: {
    latitude: number;
    longitude: number;
    altitude: number;
  }[];
  employees: {
    employee_id: string;
    user: {
      id: string;
      name: string;
      email: string;
      userRole: "EMPLOYEE" | "ADMIN" | "MANAGER"; // você pode ajustar conforme os papéis disponíveis
      active: boolean;
    };
    registrationNumber: string;
    cpf: string;
    fullName: string;
    socialName: string;
  }[];
};

function generateCircleZone(
  center: { latitude: number; longitude: number; altitude: number },
  radiusInKm: number,
  points = 36
) {
  const earthRadius = 6371; // km
  const lat = center.latitude * (Math.PI / 180);
  const lon = center.longitude * (Math.PI / 180);
  const d = radiusInKm / earthRadius;

  const polygon = [];
  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;
    const latPoint = Math.asin(
      Math.sin(lat) * Math.cos(d) +
        Math.cos(lat) * Math.sin(d) * Math.cos(angle)
    );
    const lonPoint =
      lon +
      Math.atan2(
        Math.sin(angle) * Math.sin(d) * Math.cos(lat),
        Math.cos(d) - Math.sin(lat) * Math.sin(latPoint)
      );
    polygon.push({
      latitude: (latPoint * 180) / Math.PI,
      longitude: (lonPoint * 180) / Math.PI,
      altitude: center.altitude ?? 0,
    });
  }
  return polygon;
}

// Exemplo de uso:
const myLocation = {
  latitude: -2.5168037,
  longitude: -44.2459728,
  altitude: 15.100000381469727,
};

const zona10km: Zone = {
  zone_id: "zona-10km",
  name: "Zona de 10km",
  description: "Zona gerada automaticamente de 10km",
  points: generateCircleZone(myLocation, 0.1),
  employees: [],
};

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [riskAreas, setRiskAreas] = useState<Zone[]>([]);

  const { token } = useAuth();

  // Pega a localização do GPS
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permissão para acessar a localização negada.");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => setLocation(loc.coords)
      );
    })();

    if (location) console.log(location);

    setRiskAreas((prev) => [...prev, zona10km]);

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const getArea = async () => {
    // Pega as zonas perigosas da API
    const res = await fetch(`${URL_API}/zone/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await res.json();

    setRiskAreas(data);
  };

  const sendLocation = async () => {
    // Mandar a localização para a API
    const res = await fetch(`${URL_API}/send-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        registration_number: "1",
        longitude: location?.longitude,
        latitude: location?.latitude,
        altitude: location?.altitude,
      }),
    });

    const data = await res.json();
    if (checkArea()) {
      Alert.alert("Atenção!", `Você está em área restrita: ${data.area}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    }
  };

  // const playAlarm = async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("../assetsr") // path/to/audio
  //   )

  //   await sound.playAsync();
  // }

  const isPointInPolygon = (
    point: { latitude: number; longitude: number },
    polygon: { latitude: number; longitude: number }[]
  ) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude,
        yi = polygon[i].longitude;
      const xj = polygon[j].latitude,
        yj = polygon[j].longitude;

      const intersect =
        yi > point.longitude !== yj > point.longitude &&
        point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const checkArea = (): boolean => {
    if (!location || !riskAreas.length) return false;
    const point = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    return riskAreas.some((zone) => isPointInPolygon(point, zone.points));
  };

  useEffect(() => {
    //  getArea();
    if (location) sendLocation();
    if (checkArea()) {
    }
  }, [location]);

  if (errorMsg) {
    return (
      <SafeAreaView className="flex h-full items-center justify-center">
        <Text>{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView className="flex h-full items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Carrengando localização...</Text>
      </SafeAreaView>
    );
  }

  function renderRiskAreas(zones: Zone[]) {
    return zones.map((zone) => (
      <Polygon
        key={zone.zone_id}
        coordinates={zone.points.map(({ latitude, longitude }) => ({
          latitude,
          longitude,
        }))}
        strokeColor="red"
        fillColor="rgba(255,0,0,0.4)"
        strokeWidth={2}
      />
    ));
  }

  console.log(riskAreas);

  return (
    <SafeAreaView className="flex h-full items-center bg-black">
      <MapView
        style={{ width: "100%", height: "40%" }}
        mapType="terrain"
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        scrollEnabled={true}
        rotateEnabled={false}
        zoomEnabled={true}
        pitchEnabled={false}
      >
        {renderRiskAreas(riskAreas)}
      </MapView>
      <View className="flex gap-2 mt-4">
        <Text className="text-white">Latitude {location.latitude}</Text>
        <Text className="text-white">Longitude {location.longitude}</Text>
        <Text className="text-white">Altitude {location.altitude}</Text>
        <Text className="text-white">
          Velocidade {location.speed?.toFixed(2)}
        </Text>
        <Text className={`${checkArea() ? "text-red-500" : "text-green-500"}`}>
          {checkArea() ? "Unsafe" : "Safe"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
