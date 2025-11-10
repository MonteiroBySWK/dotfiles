import { useEffect, useRef } from "react";
import gsap from "gsap";

const timeline = [
	{
		year: "2019",
		title: "🌱 Primeiro Contato com Código",
		description:
			"Comecei a aprender Python por conta própria, motivado por um professor e vídeos online. A experiência me fascinou e segui estudando até o ensino médio, quando foquei nos vestibulares militares.",
	},
	{
		year: "2022–2023",
		title: "🔁 Reencontro com a Programação",
		description:
			"Após o ensino médio, voltei a estudar Python e entrei em Engenharia da Computação, reacendendo minha paixão por tecnologia.",
	},
	{
		year: "2023–2024",
		title: "🚀 Início Profissional",
		description:
			"Participei de projetos reais, desenvolvendo soluções web, liderando equipes e aprimorando habilidades em UI/UX, animações e integrações.",
	},
];

export default function Timeline() {
	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.fromTo(
			sectionRef.current,
			{ opacity: 0, y: 60 },
			{ opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
		);
	}, []);

	return (
		<section
			id="timeline"
			ref={sectionRef}
			className="py-24 px-4 max-w-3xl mx-auto"
		>
			<h2 className="text-4xl font-extrabold text-blue-300 mb-8 text-center drop-shadow-lg">
				Linha do Tempo
			</h2>
			<div className="relative border-l-4 border-purple-500 ml-6">
				{timeline.map((item) => (
					<div key={item.year} className="mb-12 ml-6 relative">
						<div className="absolute -left-7 top-1 w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
						<h3 className="text-xl font-bold text-purple-300 mb-1">
							{item.title}
						</h3>
						<span className="text-sm text-blue-200 font-semibold">
							{item.year}
						</span>
						<p className="text-purple-100 mt-2 leading-relaxed">
							{item.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
