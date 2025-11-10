import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
import os

# Configurações visuais
sns.set(style="whitegrid")

matplotlib.use("Qt5Agg")

# 1. Carregar os dados
df = pd.read_csv("zenith.csv")
df["data_dia"] = pd.to_datetime(df["data_dia"])

os.system("clear")

# 2. Informações iniciais
print(df.info())
print(df.describe())

# 3. Verificar valores ausentes
plt.figure(figsize=(10, 4))
sns.heatmap(df.isnull(), cbar=False, cmap="viridis")
plt.title("Valores Ausentes")
plt.tight_layout()
plt.show()

# 4. Histograma de vendas diárias
plt.figure(figsize=(8, 4))
df["total_venda_dia_kg"].hist(bins=30)
plt.title("Distribuição das Vendas Diárias (kg)")
plt.xlabel("Total Venda Dia (kg)")
plt.ylabel("Frequência")
plt.tight_layout()
plt.show()

# 5. Boxplot
plt.figure(figsize=(8, 2))
sns.boxplot(x="total_venda_dia_kg", data=df)
plt.title("Boxplot de Vendas Diárias")
plt.tight_layout()
plt.show()

# 6. Correlação e Análise por Dia da Semana
# Criar colunas auxiliares
df["dia_semana"] = df["data_dia"].dt.dayofweek  # 0=segunda, 6=domingo
dias_nome = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
df["nome_dia"] = df["dia_semana"].apply(lambda x: dias_nome[x])
df["semana"] = ((df["data_dia"] - df["data_dia"].min()).dt.days // 7) + 1

# Correlação temporal
df["dias_desde_inicio"] = (df["data_dia"] - df["data_dia"].min()).dt.days

# Matriz de correlação
corr = df[["dias_desde_inicio", "total_venda_dia_kg"]].corr()

# Visualização da correlação
plt.figure(figsize=(5, 4))
sns.heatmap(corr, annot=True, cmap="coolwarm")
plt.title("Correlação com o tempo (em dias)")
plt.tight_layout()
plt.show()

# HEATMAP 1: Média de vendas por dia da semana (visão geral)
vendas_por_dia = df.groupby("nome_dia")["total_venda_dia_kg"].mean()
vendas_por_dia = vendas_por_dia.reindex(dias_nome)  # garantir ordem correta
vendas_heatmap = vendas_por_dia.to_frame().T  # virar linha única

plt.figure(figsize=(10, 2))
sns.heatmap(vendas_heatmap, annot=True, cmap="YlOrRd", fmt=".2f", cbar=True)
plt.title("Média de Vendas (kg) por Dia da Semana")
plt.yticks([])  # remove o eixo y (já que é uma linha só)
plt.tight_layout()
plt.show()

# HEATMAP 2: Mapa semana × dia da semana (padrão completo)
tabela = df.pivot_table(index="semana", columns="nome_dia", values="total_venda_dia_kg")
tabela = tabela[dias_nome]  # garantir ordem dos dias

plt.figure(figsize=(10, 6))
sns.heatmap(tabela, annot=True, fmt=".1f", cmap="YlOrRd", linewidths=0.5, linecolor="gray")
plt.title("Mapa de Calor: Vendas por Semana e Dia da Semana")
plt.xlabel("Dia da Semana")
plt.ylabel("Semana (desde início dos dados)")
plt.tight_layout()
plt.show()


# 7. Adicionar média móvel de 7 dias
df["media_movel_7d"] = df["total_venda_dia_kg"].rolling(window=7).mean()

# 8. Calcular limites para detecção de anomalias
media = df["total_venda_dia_kg"].mean()
desvio = df["total_venda_dia_kg"].std()
limite_superior = media + 2 * desvio
limite_inferior = media - 2 * desvio

# 9. Classificar pontos anômalos
df["anomalia"] = df["total_venda_dia_kg"].apply(
    lambda x: (
        "pico"
        if x > limite_superior
        else ("queda" if x < limite_inferior else "normal")
    )
)

# 10. Separar picos e quedas
picos = df[df["anomalia"] == "pico"]
quedas = df[df["anomalia"] == "queda"]

# 11. Gráfico final com tudo
plt.figure(figsize=(14, 6))
sns.lineplot(x="data_dia", y="total_venda_dia_kg", data=df, label="Vendas Diárias")
sns.lineplot(
    x="data_dia",
    y="media_movel_7d",
    data=df,
    label="Média Móvel 7 dias",
    color="orange",
)

# Destacar anomalias
plt.scatter(
    picos["data_dia"], picos["total_venda_dia_kg"], color="red", label="Pico", zorder=5
)
plt.scatter(
    quedas["data_dia"],
    quedas["total_venda_dia_kg"],
    color="purple",
    label="Queda",
    zorder=5,
)

# Linhas de referência
plt.axhline(limite_superior, color="red", linestyle="--", alpha=0.3)
plt.axhline(limite_inferior, color="purple", linestyle="--", alpha=0.3)

plt.title("Vendas Diárias (kg) com Detecção de Anomalias")
plt.xlabel("Data")
plt.ylabel("Total Venda Dia (kg)")
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 12. Exportar anomalias para CSV (opcional)
df_anomalias = df[df["anomalia"] != "normal"]
df_anomalias.to_csv("anomalias_zenith.csv", index=False)
