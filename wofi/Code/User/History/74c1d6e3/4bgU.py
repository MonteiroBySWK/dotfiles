from django.db import models
from django.core.exceptions import ValidationError


class Caixa(models.Model):
    saldo_atual = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.pk and Caixa.objects.exists():
            raise ValueError(
                "Já existe uma instância de Caixa. Não é possível criar outra."
            )
        super().save(*args, **kwargs)

    def has_add_permission(self, request):
        return False

    def atualizar_saldo(self):
        entradas = Entrada.objects.aggregate(total=models.Sum("valor"))["total"] or 0
        saidas = Saida.objects.aggregate(total=models.Sum("valor"))["total"] or 0
        self.saldo_atual = entradas - saidas
        self.save()

    def __str__(self):
        return f"Caixa - Saldo: {self.saldo_atual} R$"


class Entrada(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateTimeField(auto_now_add=True)
    pedido = models.ForeignKey(
        "servicos.Pedido",
        on_delete=models.SET_NULL,
        related_name="servico",
        null=True,
        blank=True,
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Caixa.objects.first().atualizar_saldo()

    def clean(self):
        if self.valor < 0:
            raise ValidationError("O valor da entrada não pode ser negativo.")

    def __str__(self):
        return f"{self.descricao} - {self.valor} R$"


class Saida(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Caixa.objects.first().atualizar_saldo()

    def clean(self):
        if self.valor < 0:
            raise ValidationError("O valor da saída não pode ser negativo.")

    def __str__(self):
        return f"{self.descricao} - {self.valor} R$"
