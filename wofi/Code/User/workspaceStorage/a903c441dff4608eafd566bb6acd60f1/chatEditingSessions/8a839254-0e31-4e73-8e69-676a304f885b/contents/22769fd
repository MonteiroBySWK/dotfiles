import { BsWhatsapp } from "react-icons/bs"
import TitleSection from "../components/ui/TitleSection"

export default function ContactMe() {
  return (
    <section className="flex flex-col h-screen items-center justify-center p-4">
      <TitleSection>Entre em Contato</TitleSection>
      <form className="flex flex-col text-white gap-5 w-full max-w-lg">
        <input
          type="text"
          placeholder="Seu nome"
          className="bg-card p-2 focus:outline-primary w-full"
        />
        <textarea
          name="message"
          id="message"
          placeholder="Sua Mensagem"
          className="bg-card p-2 w-full h-32"
        ></textarea>
        <button
          type="submit"
          className="bg-primary/60 duration-200 hover:bg-primary p-2 flex items-center justify-center gap-2"
        >
          <span>Enviar via</span> <BsWhatsapp />
        </button>
      </form>
    </section>
  )
}