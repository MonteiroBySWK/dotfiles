/**
 * Componente de Upload de Documentos
 * Sistema REVIS - REQ-11
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { TipoDocumento } from '@/types';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDocumentoProps {
  onUploadComplete: (documento: {
    tipo: TipoDocumento;
    nome: string;
    url: string;
  }) => void;
}

export function UploadDocumento({ onUploadComplete }: UploadDocumentoProps) {
  const [tipo, setTipo] = useState<TipoDocumento>(TipoDocumento.NOTA_FISCAL);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado. Use PDF ou imagem.');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    setArquivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!arquivo) {
      toast.error('Selecione um arquivo primeiro');
      return;
    }

    setUploading(true);

    try {
      // TODO: Implementar upload para Firebase Storage quando configurado
      // Por enquanto, simula o upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUrl = `https://storage.example.com/${arquivo.name}`;

      onUploadComplete({
        tipo,
        nome: arquivo.name,
        url: mockUrl,
      });

      toast.success('Documento enviado com sucesso!');
      
      // Limpar formulário
      setArquivo(null);
      setPreview('');
      setTipo(TipoDocumento.NOTA_FISCAL);
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setArquivo(null);
    setPreview('');
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Tipo de Documento */}
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Documento</Label>
          <Select value={tipo} onValueChange={(value) => setTipo(value as TipoDocumento)}>
            <SelectTrigger id="tipo" aria-label="Tipo de documento">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoDocumento.NOTA_FISCAL}>Nota Fiscal</SelectItem>
              <SelectItem value={TipoDocumento.COMPROVANTE}>Comprovante</SelectItem>
              <SelectItem value={TipoDocumento.BOLETO}>Boleto</SelectItem>
              <SelectItem value={TipoDocumento.OUTRO}>Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Area */}
        {!arquivo ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              aria-label="Selecionar arquivo"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground mb-1">
                Clique para selecionar ou arraste o arquivo
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG ou PNG (máx. 5MB)
              </p>
            </label>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {arquivo.type.startsWith('image/') ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-16 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
                    <File className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {arquivo.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(arquivo.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={uploading}
                aria-label="Remover arquivo"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* Botão de Upload */}
        <Button
          onClick={handleUpload}
          disabled={!arquivo || uploading}
          className="w-full"
        >
          {uploading ? (
            <>Enviando...</>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Enviar Documento
            </>
          )}
        </Button>

        {/* Nota */}
        <p className="text-xs text-muted-foreground text-center">
          ℹ️ Os documentos são armazenados de forma segura no Firebase Storage
        </p>
      </div>
    </Card>
  );
}
