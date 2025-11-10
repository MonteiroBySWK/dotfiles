import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
        <p>Este é o conteúdo principal do card. Pode conter texto, imagens ou outros componentes.</p>
      </CardContent>
      <CardFooter>
        <Button>Confirmar</Button>
      </CardFooter>
    </Card>

    </div>
  );
}
