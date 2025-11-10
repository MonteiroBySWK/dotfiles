import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirecionar para a página inicial
  redirect('/');
  
  // Este return nunca será executado devido ao redirecionamento,
  // mas é necessário para satisfazer o TypeScript
  return null;
}