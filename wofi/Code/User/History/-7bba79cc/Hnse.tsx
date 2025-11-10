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

                <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[
                        {
                            name: "Dra. Ana Oliveira",
                            role: "Pesquisadora",
                            area: "Controle Preditivo"
                        },
                        {
                            name: "Dr. Marcos Santos",
                            role: "Pesquisador",
                            area: "Inteligência Artificial"
                        },
                        {
                            name: "João Pereira",
                            role: "Doutorando",
                            area: "Sistemas Embarcados"
                        },
                        {
                            name: "Carla Mendes",
                            role: "Mestranda",
                            area: "Visão Computacional"
                        },
                        {
                            name: "Rafael Costa",
                            role: "Mestrando",
                            area: "Redes Industriais"
                        },
                        {
                            name: "Juliana Lima",
                            role: "Iniciação Científica",
                            area: "IoT Industrial"
                        },
                        {
                            name: "Pedro Alves",
                            role: "Iniciação Científica",
                            area: "Automação"
                        },
                        {
                            name: "Mariana Souza",
                            role: "Iniciação Científica",
                            area: "Eficiência Energética"
                        }
                    ].map((member) => (
                        <div 
                            key={member.name}
                            className="flex flex-col items-center space-y-3 text-center group"
                        >
                            <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-brand-primary-dark/20 transition-transform duration-300 ease-out transform group-hover:scale-110">
                                <img
                                    alt={member.name}
                                    src="/placeholder-user.jpg"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground group-hover:text-brand-primary-dark transition-colors">
                                    {member.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <p className="text-sm text-brand-primary-dark/80">{member.area}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}