import { Box, Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function MainDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Meu Card</CardTitle>
          <CardDescription>Descrição do card para contexto</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Este é o conteúdo principal do card. Pode conter texto, imagens ou
            outros componentes.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Confirmar</Button>
        </CardFooter>
      </Card>
      <Card className="w-64 p-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
          <Box className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <div className="flex items-center text-sm text-blue-600 mt-1">
            <Clock className="h-4 w-4" />
            <span className="ml-1">Prazo médio: 14 dias</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
