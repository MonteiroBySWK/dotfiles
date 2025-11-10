export default function Footer() {
  return (
    <footer className="w-container text-white py-6 px-4 flex items-center justify-between text-sm">
      <div className="mb-2 md:mb-0">
        © {new Date().getFullYear()} MonteiroBySWK. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
