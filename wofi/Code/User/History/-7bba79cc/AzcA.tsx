import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
                
                <div className="mx-auto max-w-3xl mt-16">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <div className="relative h-40 w-40 rounded-full overflow-hidden ring-2 ring-brand-primary-dark/20">
                            <img 
                                alt="Professor Coordenador" 
                                src="/placeholder-user.jpg"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-primary-dark to-brand-accent bg-clip-text text-transparent">
                                Prof. Dr. José Pinheiro
                            </h3>
                            <p className="text-muted-foreground">Coordenador do Laboratório</p>
                            <p className="max-w-[500px] text-muted-foreground">
                                Doutor em Engenharia Elétrica com ênfase em Controle e Automação. 
                                Possui mais de 15 anos de experiência em projetos industriais e acadêmicos.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                variant="outline"
                                asChild
                                className="border-brand-primary-dark/20 hover:bg-brand-primary-dark/10"
                            >
                                <a 
                                    href="http://lattes.cnpq.br/9437910347392764" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Currículo Lattes
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                className="border-brand-primary-dark/20 hover:bg-brand-primary-dark/10"
                            >
                                Publicações
                            </Button>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-center mt-16 mb-12 bg-gradient-to-r from-brand-primary-dark to-brand-accent bg-clip-text text-transparent">
                    Pesquisadores e Estudantes
                </h3>

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
                    ].map((member, index) => (
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