import { Button } from "./ui/button";

export default function Team() {
    return (
        <section className="py-24 bg-background/50 border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2 max-w-3xl">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-brand-primary-dark to-brand-accent bg-clip-text text-transparent">
                            Nossa Equipe
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl">
                            Conheça os pesquisadores e estudantes que fazem parte do nosso laboratório.
                        </p>
                    </div>
                </div>
                

                <h3 className="text-2xl font-bold text-center mt-16 mb-12 bg-gradient-to-r from-brand-primary-dark to-brand-accent bg-clip-text text-transparent">
                    Pesquisadores e Estudantes
                </h3>

                <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[
                        {
                            name: "Suamí Gomes",
                            role: "Presidente",
                            src: "/team/suami.jpeg"
                        },
                        {
                            name: "Maurício Melo",
                            role: "Vice-Presidente",
                            src: "/team/mauricio.jpg"
                        },
                        {
                            name: "Marcos Vinícius",
                            role: "Gerente de Projetos",
                            src: "/team/marcos.jpg"
                        },
                        {
                            name: "Carlos Augusto",
                            role: "Assistente de Projetos",
                            src: "/team/carlos.jpg"
                        },
                        {
                            name: "Murilo Castelhano",
                            role: "Assistente de Projetos da Thera",
                            src: "/team/murilo.jpeg"
                        },
                        {
                            name: "Cícero Gabriel",
                            role: "Secretaria",
                            src: "/team/cicero.jpg"
                        },
                        {
                            name: "Vinícius Oliveira",
                            role: "Secretaria",
                            src: "/team/vinicius.jpg"
                        },
                        {
                            name: "Julio Silva",
                            role: "Marketing",
                            src: "/team/julio.jpg"
                        }
                    ].map((member) => (
                        <div 
                            key={member.name}
                            className="flex flex-col items-center space-y-3 text-center group"
                        >
                            <div className="relative h-30 w-30 rounded-full overflow-hidden ring-2 ring-brand-primary-dark/20 transition-transform duration-300 ease-out transform group-hover:scale-110">
                                <img
                                    alt={member.name}
                                    src={member.src}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground group-hover:text-brand-primary-dark transition-colors">
                                    {member.name}
                                </h4>
                                <p className="text-sm text-brand-primary-dark/80">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}