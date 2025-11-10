export default function TitleSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-primary font-extrabold text-5xl mb-10">{children}</h1>;
}
