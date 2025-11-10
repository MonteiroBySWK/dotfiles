struct Aluno {
    char nome[50];
    int idade;
    int matricula;
};

typedef struct Aluno Aluno;

Aluno* criarAluno(char[50] nome, int idade, int matricula) {
    Aluno* a = (Aluno*)malloc(sizeof(Aluno));

    // Ficaria a logica de validação e de negocio

    return a;
}




