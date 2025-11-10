export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 px-4 flex flex-col md:flex-row items-center justify-between text-sm">
      <span>
        © {new Date().getFullYear()} MonteiroBySWK. Todos os direitos
        reservados.
      </span>
    </footer>
  );
}
