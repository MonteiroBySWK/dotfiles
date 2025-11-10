#include <stdlib.h>
#include "aluno.h"

struct Aluno {
    char nome[50];
    int idade;
    int matricula;
};

typedef struct Aluno Aluno;

Aluno* criarAluno(char* nome, int idade, int matricula) {
    Aluno* a = (Aluno*)malloc(sizeof(Aluno));

    // Ficaria a logica de validação e de negocio

    return a;
}


