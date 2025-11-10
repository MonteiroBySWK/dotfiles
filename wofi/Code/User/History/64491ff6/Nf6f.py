from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from servicos.models import Gerais
from .models import Entrada, Saida, Caixa


@receiver([post_save, post_delete], sender=Entrada)
@receiver([post_save, post_delete], sender=Saida)
def atualizar_saldo_caixa(sender, instance, **kwargs):
    caixa = Caixa.objects.first()
    if caixa:
        caixa.atualizar_saldo()


# Atualizar saldo no Caixa quando Gerais for salva e criar uma nova Entrada ou Saída
@receiver(post_save, sender=Gerais)
def atualizar_saldo_caixa_gerais(sender, instance, created, **kwargs):
    caixa = Caixa.objects.first()

    # Se o objeto Gerais foi criado e o Caixa existe
    if caixa:
        # Atualiza o saldo após o valor de Gerais
        caixa.atualizar_saldo()

        # Se o serviço de Gerais for uma entrada (ou saída), criamos a entrada correspondente
        if instance.valor and created:
            # Criar nova entrada ou saída dependendo do tipo de serviço
            if (
                instance.servico == "Servico_Entrada"
            ):  # Exemplo de como você pode verificar
                Entrada.objects.create(
                    descricao=f"Entrada relacionada ao serviço {instance.servico}",
                    valor=instance.valor,
                    pedido=instance.pedido,
                )
            elif (
                instance.servico == "Servico_Saida"
            ):  # Exemplo de serviço que cria uma saída
                Saida.objects.create(
                    descricao=f"Saída relacionada ao serviço {instance.servico}",
                    valor=instance.valor,
                )
