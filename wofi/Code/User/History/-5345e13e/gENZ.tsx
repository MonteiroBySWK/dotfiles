import TitleSection from "../components/TitleSection"

export default function ContactMe() {
  return (
    <section className="flex flex-col items-center justify-center">
      <TitleSection>Entre em Contato</TitleSection>
      <form>
        <input type="text" placeholder="Seu nome" />
        <textarea name="message" id="message" placeholder="Sua Mensagem"></textarea>
      </form>
    </section>
  )
}