import { BsWhatsapp } from "react-icons/bs";
import TitleSection from "../components/ui/TitleSection";
import Section from "../components/ui/Section";

export default function ContactMe() {
  return (
    <Section
      id="contact"
      className="flex flex-col min-h-screen items-center justify-center"
    >
      <TitleSection>Entre em Contato</TitleSection>

      <form className="flex flex-col gap-4 w-full max-w-lg text-white">
        {/* Nome */}
        <input
          type="text"
          placeholder="Seu nome"
          className="bg-card p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition text-sm sm:text-base"
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Seu e-mail"
          className="bg-card p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition text-sm sm:text-base"
          required
        />

        {/* Mensagem */}
        <textarea
          name="message"
          id="message"
          placeholder="Sua mensagem"
          rows={5}
          className="bg-card p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition resize-none text-sm sm:text-base"
          required
        />

        {/* Botão */}
        <button
          type="submit"
          className="bg-primary/80 hover:bg-primary flex items-center justify-center gap-2 p-3 font-medium transition duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <BsWhatsapp size={20} />
          Enviar via WhatsApp
        </button>
      </form>
    </Section>
  );
}
