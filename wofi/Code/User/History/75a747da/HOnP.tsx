export default function TitleSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-primary font-extrabold text-4xl sm:text-5xl mb-8 sm:mb-10 text-center">{children}</h1>;
}
