import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";

export default function MainDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardTitle>Projetos</CardTitle>
        <CardDescription>ADNAdnadnajs</CardDescription>
        <CardContent>Sim</CardContent>
        <CardAction>Sim</CardAction>
      </Card>
    </div>
  );
}
