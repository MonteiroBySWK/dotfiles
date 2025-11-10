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
      <Card>
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
        </CardHeader>
        <CardDescription>ADNAdnadnajs</CardDescription>
        <CardContent>Sim</CardContent>
        <CardAction>Sim</CardAction>
      </Card>
    </div>
  );
}
