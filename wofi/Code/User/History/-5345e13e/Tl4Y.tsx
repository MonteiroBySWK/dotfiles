import TitleSection from "../components/TitleSection"

export default function ContactMe() {
  return (
    <section>
      <TitleSection>Entre em Contato</TitleSection>
      <form>
        <input type="text" placeholder="Seu nome" />
        <textarea name="message" id="message" placeholder="Sua Mensagem"></textarea>
      </form>
    </section>
  )
}