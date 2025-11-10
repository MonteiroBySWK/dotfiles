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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Projetos Ativos</CardTitle>
          <Box />
        </CardHeader>
        <CardContent>
          <div>8</div>
          <div>
            <Clock />
            <span>Prazo médio: 14 dias</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
