#include "./aluno.h"

struct node {
    Aluno dados;
    struct node* next;
};

typedef struct node Node;

Node* createQueue() {
    Node* node = (Node*)malloc(sizeof(Node));
    return node;
}

Node* createNode() {
    Node* node = (Node*)malloc(sizeof(Node));
    


    return node;
}