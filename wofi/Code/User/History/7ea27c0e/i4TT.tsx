export default function Section(
  props: { id: string },
  { children }: { children: React.ReactNode }
) {
  return <section id={props.id} className="max-w-8xl">{children}</section>;
}
