'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatPreviewModal } from './dat-preview-modal';
import { SaleData } from '@/types/sales';

interface DatFileUploadProps {
  onFileProcessed: () => void;
  onClose: () => void;
}

export function DatFileUpload({ onFileProcessed, onClose }: DatFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<SaleData[] | null>(null);
  const [originalData, setOriginalData] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filename, setFilename] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.dat')) {
      setError('Por favor, selecione apenas arquivos .dat');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const datFile = files.find((file: File) => file.name.endsWith('.dat'));
    
    if (datFile) {
      handleFileSelect(datFile);
    } else {
      setError('Por favor, arraste apenas arquivos .dat');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Enviar para uma nova API route que usará o Reader
      const response = await fetch('/api/upload-dat', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao processar arquivo');
      }

      // Mostrar preview dos dados ao invés de processar diretamente
      setPreviewData(result.data);
      setOriginalData(result.originalData);
      setFilename(result.filename);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewConfirm = () => {
    onFileProcessed();
    onClose();
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setPreviewData(null);
    setOriginalData(null);
    setFilename('');
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    setPreviewData(null);
    setOriginalData(null);
    setShowPreview(false);
    setFilename('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Se estiver mostrando preview, renderizar o modal de preview
  if (showPreview && previewData) {
    return (
      <DatPreviewModal
        data={previewData}
        originalData={originalData || []}
        filename={filename}
        onConfirm={handlePreviewConfirm}
        onCancel={handlePreviewCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Arquivo .dat</CardTitle>
              <CardDescription>
                Selecione ou arraste um arquivo .dat para processar
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : selectedFile
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-green-600" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFile}
                  className="mt-2"
                >
                  Remover arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Arraste um arquivo .dat aqui
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ou clique para selecionar
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Selecionar Arquivo
                </Button>
              </div>
            )}
          </div>

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".dat"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedFile || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}