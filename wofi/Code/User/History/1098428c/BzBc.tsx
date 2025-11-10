"use client";

import { useState } from "react";
import { SalesTable } from "@/components/custom/sales-table";
import { DatFileUpload } from "@/components/custom/dat-file-upload";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SaleData } from "@/types/sales";

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedData, setUploadedData] = useState<SaleData[] | null>(null);

  const handleFileProcessed = (data: SaleData[]) => {
    setUploadedData(data);
  };

  const handleClearUploadedData = () => {
    setUploadedData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Varejo Rápido
              </h1>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Carregar Arquivo .dat
              </Button>
            </div>
          </div>


        </div>

        <SalesTable uploadedData={uploadedData} />

        {showUpload && (
          <DatFileUpload
            onFileProcessed={handleFileProcessed}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    </div>
  );
}
