export default function Section(
  props: { id: string },
  { children }: { children: React.ReactNode }
) {
  return <section id={props.id}>{children}</section>;
}
