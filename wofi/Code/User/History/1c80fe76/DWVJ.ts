type CsvTemplate = {
      Name: { title: [{ text: { content: options.title } }] },
      Status: { select: { name: options.status } },
      Tipo: options.tipo ? { select: { name: options.tipo } } : undefined,
      Prioridade: options.prioridade ? { select: { name: options.prioridade } } : undefined,
      Especialidade: options.especialidade ? { select: { name: options.especialidade } } : undefined,
      Épico: options.epicoId ? { relation: [{ id: options.epicoId }] } : undefined,
      Responsável: options.responsavelId ? { relation: [{ id: options.responsavelId }] } : undefined,
      "Criado Em": options.criadoEm ? { date: { start: options.criadoEm } } : undefined,
}