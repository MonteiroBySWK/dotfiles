import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.dates as mdates


def carregar_e_preparar_dados(caminho_arquivo: str) -> pd.DataFrame:
    """
    Carrega os dados de um arquivo CSV, converte a coluna de data e
    cria colunas temporais auxiliares.
    """
    df = pd.read_csv(caminho_arquivo)
    df["data_dia"] = pd.to_datetime(df["data_dia"], dayfirst=True)
    df = df.sort_values("data_dia").reset_index(drop=True)

    # Criar colunas auxiliares
    df["dia_semana"] = df["data_dia"].dt.dayofweek
    dias_nome = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    df["nome_dia"] = df["dia_semana"].apply(lambda x: dias_nome[x])
    df["semana"] = ((df["data_dia"] - df["data_dia"].min()).dt.days // 7) + 1
    df["dias_desde_inicio"] = (df["data_dia"] - df["data_dia"].min()).dt.days

    return df


def plotar_distribuicao_vendas(df: pd.DataFrame):
    """
    Plota o histograma e o boxplot das vendas diárias em uma única figura.
    """
    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(10, 6), gridspec_kw={"height_ratios": [3, 1]}
    )
    fig.suptitle("Distribuição e Resumo das Vendas Diárias (kg)", fontsize=16)

    # Histograma
    sns.histplot(data=df, x="total_venda_dia_kg", bins=30, ax=ax1, kde=True)
    ax1.set_title("Frequência das Vendas Diárias")
    ax1.set_xlabel("")
    ax1.set_ylabel("Frequência (dias)")

    # Boxplot
    sns.boxplot(data=df, x="total_venda_dia_kg", ax=ax2)
    ax2.set_title("Boxplot das Vendas Diárias")
    ax2.set_xlabel("Total Venda Dia (kg)")

    plt.tight_layout(rect=(0, 0.03, 1, 0.95))
    plt.show()


def plotar_analise_semanal(df: pd.DataFrame):
    """
    Plota os heatmaps de análise de vendas por dia da semana.
    """
    dias_nome = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

    # Heatmap de Média
    vendas_por_dia = (
        df.groupby("nome_dia")["total_venda_dia_kg"].mean().reindex(dias_nome)
    )
    plt.figure(figsize=(10, 2))
    sns.heatmap(
        vendas_por_dia.to_frame().T, annot=True, cmap="YlOrRd", fmt=".2f", cbar=True
    )
    plt.title("Média de Vendas (kg) por Dia da Semana")
    plt.yticks([])
    plt.tight_layout()
    plt.show()

    # Heatmap Detalhado
    tabela_pivot = df.pivot_table(
        index="semana", columns="nome_dia", values="total_venda_dia_kg"
    )
    tabela_pivot = tabela_pivot.reindex(columns=dias_nome)
    plt.figure(figsize=(10, 6))
    sns.heatmap(
        tabela_pivot,
        annot=True,
        fmt=".1f",
        cmap="YlOrRd",
        linewidths=0.5,
        linecolor="gray",
    )
    plt.title("Mapa de Calor: Vendas por Semana e Dia da Semana")
    plt.xlabel("Dia da Semana")
    plt.ylabel("Semana (desde início dos dados)")
    plt.tight_layout()
    plt.show()


def detectar_anomalias(
    df: pd.DataFrame, window: int = 7, num_desvios: float = 2.0
) -> pd.DataFrame:
    """
    Calcula a média móvel e detecta anomalias com base em desvios padrão.
    """
    df_copy = df.copy()
    df_copy["media_movel"] = df_copy["total_venda_dia_kg"].rolling(window=window).mean()

    media = df_copy["total_venda_dia_kg"].mean()
    desvio = df_copy["total_venda_dia_kg"].std()
    limite_superior = media + num_desvios * desvio
    limite_inferior = media - num_desvios * desvio

    df_copy["limite_superior"] = limite_superior
    df_copy["limite_inferior"] = limite_inferior

    df_copy["anomalia"] = "normal"
    df_copy.loc[df_copy["total_venda_dia_kg"] > limite_superior, "anomalia"] = "pico"
    df_copy.loc[df_copy["total_venda_dia_kg"] < limite_inferior, "anomalia"] = "queda"

    return df_copy


def plotar_serie_com_anomalias(df: pd.DataFrame, window_size: int):
    """
    Plota a série temporal de vendas, destacando a média móvel e as anomalias.
    """
    picos = df[df["anomalia"] == "pico"]
    quedas = df[df["anomalia"] == "queda"]

    plt.figure(figsize=(15, 7))
    sns.lineplot(
        x="data_dia", y="total_venda_dia_kg", data=df, label="Vendas Diárias", zorder=2
    )

    sns.lineplot(
        x="data_dia",
        y="media_movel",
        data=df,
        label=f"Média Móvel {window_size} dias",
        color="orange",
        zorder=3,
    )

    plt.scatter(
        picos["data_dia"],
        picos["total_venda_dia_kg"],
        color="red",
        label="Pico de Vendas",
        zorder=5,
        s=80,
    )
    plt.scatter(
        quedas["data_dia"],
        quedas["total_venda_dia_kg"],
        color="purple",
        label="Queda de Vendas",
        zorder=5,
        s=80,
    )

    plt.axhline(
        df["limite_superior"].iloc[0],
        color="red",
        linestyle="--",
        alpha=0.5,
        label=f"Limite Superior ({df['limite_superior'].iloc[0]:.2f} kg)",
    )
    plt.axhline(
        df["limite_inferior"].iloc[0],
        color="purple",
        linestyle="--",
        alpha=0.5,
        label=f"Limite Inferior ({df['limite_inferior'].iloc[0]:.2f} kg)",
    )

    plt.title("Análise de Vendas Diárias (kg) com Detecção de Anomalias", fontsize=16)
    plt.xlabel("Data")
    plt.ylabel("Total Venda Dia (kg)")
    plt.legend(loc="upper left")
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter("%d-%m-%Y"))
    plt.xticks(rotation=45)
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.tight_layout()
    plt.show()


def gerar_relatorio_sumario(df: pd.DataFrame):
    """
    Imprime um relatório de texto com os principais insights e KPIs da análise.
    """
    dias_nome = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
    df_anomalias = df[df["anomalia"] != "normal"]
    media_geral = df["total_venda_dia_kg"].mean()
    vendas_por_dia = (
        df.groupby("nome_dia")["total_venda_dia_kg"].mean().reindex(dias_nome)
    )

    print("\n" + "=" * 50)
    print("RELATÓRIO DE ANÁLISE DE VENDAS - ZENITH")
    print("=" * 50)
    print(
        f"Período Analisado: {df['data_dia'].min().strftime('%d/%m/%Y')} a {df['data_dia'].max().strftime('%d/%m/%Y')}"
    )
    print(f"\n--- KPIs Gerais ---")
    print(f"Média de Vendas Diárias: {media_geral:.2f} kg")
    print(f"Total de Vendas no Período: {df['total_venda_dia_kg'].sum():.2f} kg")
    print(
        f"Dia com Maior Venda: {df.loc[df['total_venda_dia_kg'].idxmax()]['data_dia'].strftime('%d/%m/%Y')} ({df['total_venda_dia_kg'].max():.2f} kg)"
    )
    print(
        f"Dia com Menor Venda: {df.loc[df['total_venda_dia_kg'].idxmin()]['data_dia'].strftime('%d/%m/%Y')} ({df['total_venda_dia_kg'].min():.2f} kg)"
    )

    print("\n--- Desempenho Semanal (Médias) ---")
    print(
        f"Dia de Maior Média de Vendas: {vendas_por_dia.idxmax()} ({vendas_por_dia.max():.2f} kg)"
    )
    print(
        f"Dia de Menor Média de Vendas: {vendas_por_dia.idxmin()} ({vendas_por_dia.min():.2f} kg)"
    )

    print("\n--- Relatório de Anomalias ---")
    if df_anomalias.empty:
        print("Nenhuma anomalia detectada no período.")
    else:
        print(f"Total de anomalias detectadas: {len(df_anomalias)}")
        for _, anomalia in df_anomalias.iterrows():
            tipo = anomalia["anomalia"].upper()
            data = anomalia["data_dia"].strftime("%d/%m/%Y (%a)")
            valor = anomalia["total_venda_dia_kg"]
            media_dia = vendas_por_dia[anomalia["nome_dia"]]
            diff = valor - media_dia
            print(
                f"  - {tipo}: {data} | Venda: {valor:.2f} kg (Diferença de {diff:+.2f} kg para a média do dia)"
            )

    print("\n" + "=" * 50)

    # Exportar anomalias para CSV (opcional)
    df_anomalias.to_csv("anomalias_zenith.csv", index=False)
    print("Arquivo 'anomalias_zenith.csv' foi gerado com os detalhes.")


# --- Bloco Principal de Execução ---
if __name__ == "__main__":
    # Configurações
    ARQUIVO_CSV = "zenith.csv"
    NUMERO_DESVIOS_PADRAO = 2.0
    JANELA_MEDIA_MOVEL = 7

    # 1. Carregar e Processar os Dados
    df_dados = carregar_e_preparar_dados(ARQUIVO_CSV)

    # 2. Análise Visual
    plotar_distribuicao_vendas(df_dados)
    plotar_analise_semanal(df_dados)

    # 3. Detectar Anomalias
    df_com_anomalias = detectar_anomalias(
        df_dados, window=JANELA_MEDIA_MOVEL, num_desvios=NUMERO_DESVIOS_PADRAO
    )

    # 4. Plotar Série Temporal Completa
    plotar_serie_com_anomalias(df_com_anomalias, window_size=JANELA_MEDIA_MOVEL)

    # 5. Gerar Relatório Final com Insights
    gerar_relatorio_sumario(df_com_anomalias)
