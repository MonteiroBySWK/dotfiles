import { BsWhatsapp } from "react-icons/bs"
import TitleSection from "../components/TitleSection"

export default function ContactMe() {
  return (
    <section className="flex flex-col h-screen items-center justify-center">
      <TitleSection>Entre em Contato</TitleSection>
      <form className="flex flex-col text-white gap-5">
        <input type="text" placeholder="Seu nome" className="bg-card p-2 focus:outline-primary" />
        <textarea name="message" id="message" placeholder="Sua Mensagem" className="bg-card p-2"></textarea>
        <button type="submit" className="bg-primary p-2 flex">Enviar via <BsWhatsapp /></button>
      </form>
    </section>
  )
}