'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SaleData, ItemRequestBody } from '@/types/sales';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Check, X, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { animations } from '@/hooks/use-gsap';
import { useAnimatedToast } from '@/hooks/use-animated-toast';

interface DatPreviewModalProps {
  data: SaleData[];
  originalData: ItemRequestBody[];
  filename: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DatPreviewModal({ data, originalData, filename, onConfirm, onCancel }: DatPreviewModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const totalValue = data.reduce((sum, sale) => sum + sale.totalValue, 0);
  const totalQuantity = data.reduce((sum, sale) => sum + sale.quantity, 0);
  const modalRef = useRef<HTMLDivElement>(null);
  const toast = useAnimatedToast();

  // Animação de entrada do modal
  useEffect(() => {
    if (modalRef.current) {
      animations.scaleIn(modalRef.current, 0);
    }
    // Animar as linhas da tabela
    setTimeout(() => {
      animations.staggerFadeIn('.preview-row', 0.05);
    }, 300);
  }, []);

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    // Animar botão de confirmação
    const confirmButton = document.querySelector('.confirm-button');
    if (confirmButton) {
      animations.bounce(confirmButton);
    }
    
    try {
      // Enviar dados originais para a API externa
      const response = await fetch('/api/confirm-dat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: originalData }),
      });

      let result = null;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        result = {};
      }
      
      if (!response.ok || !result?.success) {
        // Log do erro apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.warn('Aviso ao enviar dados:', result?.error || 'Resposta vazia');
        }
      }
      
      // Disparar evento para recarregar dados da API
      window.dispatchEvent(new CustomEvent('vendas-updated'));
      onConfirm();
    } catch (error) {
      // Mesmo com erro no envio, ainda confirma
      onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card ref={modalRef} className="w-full max-w-6xl max-h-[90vh] flex flex-col" style={{ opacity: 0, transform: 'scale(0.8)' }}>
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <div>
                <CardTitle>Preview dos Dados</CardTitle>
                <CardDescription>
                  Arquivo: {filename} • {data.length} registros encontrados
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <div className="space-y-4 h-full flex flex-col">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold">{data.length}</p>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold">{totalQuantity}</p>
                <p className="text-sm text-muted-foreground">Itens Vendidos</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>

            {/* Tabela com Scroll */}
            <div className="flex-1 border rounded-md overflow-hidden">
              <ScrollArea className="h-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Data da Venda</TableHead>
                      <TableHead className="whitespace-nowrap">Cliente</TableHead>
                      <TableHead className="whitespace-nowrap">Produto</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Qtd</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Valor Unit.</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((sale, index) => (
                      <TableRow key={`preview-${index}`} className="preview-row hover:bg-muted/50" style={{ opacity: 0 }}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(sale.saleDate)}
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate" title={sale.customerName}>
                          {sale.customerName}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={sale.productName}>
                          {sale.productName}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {sale.quantity}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatCurrency(sale.unitValue)}
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {formatCurrency(sale.totalValue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center flex-shrink-0 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Os dados acima serão carregados na tabela principal
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} disabled={isConfirming} className="confirm-button flex items-center gap-2">
                  {isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirmar e Carregar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}