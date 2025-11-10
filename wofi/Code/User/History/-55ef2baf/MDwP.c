#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#include "src/fila.h"

typedef struct aluno
{
    char nome[50];
    int idade;
    int matricula;
} Aluno;

typedef struct no
{
    Aluno dados;
    struct no *proximo;
} no;





int validarArquivo(const char *nomeArquivo)
{
    FILE *arquivo = fopen(nomeArquivo, "r");
    if (arquivo == NULL)
    {
        printf("Erro ao abrir o arquivo \"%s\".\n", nomeArquivo);
        return 0;
    }
    fclose(arquivo);
    return 1;
}

void abrirFicha(no **inicio)
{
    FILE *alunos = fopen("alunos.txt", "r");
    if (!validarArquivo("alunos.txt"))
    {
        printf("Arquivo inexistente/corrompido\n");
        return;
    }

    char nome[52];
    int idade, matricula;
    while (fgets(nome, sizeof(nome), alunos) != NULL)
    {
        nome[strcspn(nome, "\n")] = '\0';
        fscanf(alunos, "%d\n", &idade);
        fscanf(alunos, "%d\n", &matricula);
        fputs("\n", alunos);

        no *novo = malloc(sizeof(no));
        if (novo == NULL)
        {
            printf("Erro de alocação.\n");
            fclose(alunos);
            return;
        }
        strcpy(novo->nome, nome);
        novo->idade = idade;
        novo->matricula = matricula;
        novo->proximo = NULL;

        if (*inicio == NULL)
        {
            *inicio = novo;
        }
        else
        {
            no *atual = *inicio;
            while (atual->proximo != NULL)
                atual = atual->proximo;
            atual->proximo = novo;
        }
    }
}

void cadastrarAlunos(no **inicio, char nome[50], int idade, int matricula)
{
    FILE *alunos = fopen("alunos.txt", "r");
    if (!validarArquivo("alunos.txt"))
    {
        printf("Arquivo inexistente/corrompido\n");
        return;
    }

    no *novo = malloc(sizeof(no));
    if (novo == NULL)
    {
        printf("Erro de alocação de memória.\n");
        fclose(alunos);
        return;
    }
    strcpy(novo->nome, nome);
    novo->idade = idade;
    novo->matricula = matricula;
    if (*inicio == NULL)
    {
        *inicio = novo;
    }
    else
    {
        no *atual = *inicio;
        while (atual->proximo != NULL)
        {
            atual = atual->proximo;
        }
        atual->proximo = novo;
    }
    fprintf(alunos, "%s\n%d\n%d\n\n", nome, idade, matricula);
    fclose(alunos);
}

void removerAluno(no **inicio, char remover[50])
{
    FILE *alunos = fopen("alunos.txt", "r");
    if (*inicio == NULL)
    {
        printf("lista vazia");
        return;
    }
    if (!validarArquivo("alunos.txt"))
    {
        printf("Arquivo inexistente/corrompido\n");
        return;
    }
    char linha[100];
    FILE *temp = fopen("temp.txt", "r");
    if (!validarArquivo("temp.txt"))
    {
        printf("Arquivo inexistente/corrompido\n");
        return;
    }
    while (fgets(linha, sizeof(linha), alunos) != NULL)
    {
        if (strcmp(fgets(linha, sizeof(linha), alunos), remover) != 1)
        {
            fputs(linha, temp);
            fputs("\n", temp);
            fputs(linha, temp);
            fputs("\n", temp);
            fputs(linha, temp);
        }
    }
    no *atual = *inicio;
    while (atual != NULL)
    {
        no *temporario = NULL;
        if (atual->nome == remover)
        {
            strcpy(atual->nome, temporario->nome);
            atual->idade = temporario->idade;
            atual->matricula = temporario->matricula;
            free(temporario);
            free(atual);
            break;
        }
        atual = atual->proximo;
    }
    fclose(alunos);
    fclose(temp);
    if (remove("alunos.txt") == 0)
    {
        printf("arquivo removido com sucesso\n");
    }
    else
    {
        printf("falha ao remover arquivo de alunos");
    }
    rename("temp.txt", "alunos.txt");
}

void imprimirAlunos(no **inicio)
{
    no *atual = *inicio;
    if (*inicio == NULL)
    {
        printf("lista vazia");
        return;
    }
    while (atual != NULL)
    {
        printf("FICHA DO ALUNO\n");
        printf("NOME: %s\n", atual->nome);
        printf("IDADE: %d\n", atual->idade);
        printf("MATRICULA: %d\n", atual->matricula);
        atual = atual->proximo;
    }
}

void acharAluno(no **inicio, int matricula)
{
    no *atual = *inicio;
    if (*inicio == NULL)
    {
        printf("lista vazia");
        return;
    }
    while (atual != NULL)
    {
        if (atual->matricula == matricula)
        {
            printf("ALUNO ENCONTRADO\n");
            printf("NOME: %s\n", atual->nome);
            printf("IDADE: %d\n", atual->idade);
            break;
        }
        atual = atual->proximo;
    }
}

void liberarMemoria(no **inicio)
{
    no *limpar = *inicio;
    no *seguinte = NULL;
    while (limpar != NULL)
    {
        seguinte = limpar->proximo;
        free(limpar);
        limpar = seguinte;
    }
}

int main()
{
    FILE *alunos = fopen("alunos.txt", "a+");
    no *fichaAlunos = NULL;
    bool emLoop = 1;
    char nomealuno[50];
    int opção, idade, matricula;
    if (alunos != NULL)
    {
        abrirFicha(&fichaAlunos);
    }
    fclose(alunos);
    while (emLoop)
    {
        printf("1 - adicionar aluno\n");
        printf("2 - remover aluno\n");
        printf("3 - imprimir lista\n");
        printf("4 - procurar aluno\n");
        printf("0 - sair\n");
        scanf("%d", &opção);
        getchar();

        switch (opção)
        {
        case 1:
            printf("nome do aluno: ");
            fgets(nomealuno, sizeof(nomealuno), stdin);
            printf("idade do aluno: ");
            scanf("%d", &idade);
            getchar();
            printf("matricula do aluno");
            scanf("%d", &matricula);
            getchar();
            cadastrarAlunos(&fichaAlunos, nomealuno, idade, matricula);
            break;

        case 2:
            printf("nome do aluno a ser removido: ");
            fgets(nomealuno, sizeof(nomealuno), stdin);
            removerAluno(&fichaAlunos, nomealuno);
            break;

        case 3:
            imprimirAlunos(&fichaAlunos);
            break;

        case 4:
            printf("matricula do aluno que deseja encontrar os dados: ");
            scanf("%d", &matricula);
            acharAluno(&fichaAlunos, matricula);
            break;

        case 0:
            liberarMemoria(&fichaAlunos);
            return 0;

        default:
            printf("opção invalida\n");
            break;
        }
    }
}