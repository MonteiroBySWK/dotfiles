/**
 * Lista de Documentos anexados a um Pedido
 * Sistema REVIS - REQ-11
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentoPedido, TipoDocumento } from '@/types';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ListaDocumentosProps {
  documentos: DocumentoPedido[];
  onRemove?: (index: number) => void;
  readOnly?: boolean;
}

const tipoLabels: Record<TipoDocumento, string> = {
  [TipoDocumento.NOTA_FISCAL]: 'Nota Fiscal',
  [TipoDocumento.COMPROVANTE]: 'Comprovante',
  [TipoDocumento.BOLETO]: 'Boleto',
  [TipoDocumento.OUTRO]: 'Outro',
};

const tipoColors: Record<TipoDocumento, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [TipoDocumento.NOTA_FISCAL]: 'default',
  [TipoDocumento.COMPROVANTE]: 'secondary',
  [TipoDocumento.BOLETO]: 'outline',
  [TipoDocumento.OUTRO]: 'outline',
};

export function ListaDocumentos({ documentos, onRemove, readOnly = false }: ListaDocumentosProps) {
  if (documentos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" aria-hidden="true" />
        <p>Nenhum documento anexado</p>
      </div>
    );
  }

  const handleDownload = (documento: DocumentoPedido) => {
    // TODO: Implementar download real do Firebase Storage
    toast.success(`Download: ${documento.nome}`);
    window.open(documento.url, '_blank');
  };

  const handleRemoveDoc = (index: number) => {
    if (onRemove) {
      onRemove(index);
      toast.success('Documento removido');
    }
  };

  return (
    <div className="space-y-3">
      {documentos.map((doc, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-3">
            {/* Ícone */}
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {doc.nome}
                </p>
                <Badge variant={tipoColors[doc.tipo]} className="shrink-0">
                  {tipoLabels[doc.tipo]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {doc.url}
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(doc)}
                aria-label="Baixar documento"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(doc.url, '_blank')}
                aria-label="Abrir em nova aba"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>

              {!readOnly && onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDoc(index)}
                  aria-label="Remover documento"
                >
                  <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
