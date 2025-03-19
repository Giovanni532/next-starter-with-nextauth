"use client";

import { AdminPagination } from "@/components/ui/admin-pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddModelRowModal } from "./AddModelRowModal";
import { useRouter } from "next/navigation";

type ModelColumn = {
    column_name: string;
    data_type: string;
    character_maximum_length: number | null;
    column_default: string | null;
    is_nullable: string;
};

interface ModelData {
    data: any[];
    columns: ModelColumn[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface ModelDataViewProps {
    modelData: ModelData;
    modelName: string;
    formattedModelName: string;
}

export function ModelDataView({
    modelData,
    modelName,
    formattedModelName,
}: ModelDataViewProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Export functionality would go here
            // This is just a placeholder
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setIsExporting(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            router.refresh();
        } catch (error) {
            console.error("Erreur lors du rafraîchissement:", error);
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
            }, 1000);
        }
    };

    return (
        <Card className="shadow-none w-[85%] border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                    <CardTitle>Données de la table {formattedModelName}</CardTitle>
                    <CardDescription>
                        Tous les enregistrements pour {formattedModelName}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="transition-all duration-200 cursor-pointer"
                    >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? "Actualisation en cours..." : "Actualiser"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        disabled={isExporting || modelData.data.length === 0}
                        className="transition-all duration-200 cursor-pointer"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                    </Button>
                    <AddModelRowModal
                        modelName={modelName}
                        formattedModelName={formattedModelName}
                        columns={modelData.columns}
                        onSuccess={handleRefresh}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {modelData.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        {modelData.columns?.map((column: ModelColumn) => (
                                            <th
                                                key={column.column_name}
                                                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {column.column_name}
                                                <span className="ml-1 text-xs opacity-70 normal-case">
                                                    ({column.data_type})
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {modelData.data.map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
                                            {modelData.columns?.map((column: ModelColumn) => (
                                                <td
                                                    key={`${rowIndex}-${column.column_name}`}
                                                    className="px-4 py-3 text-sm"
                                                >
                                                    {formatCellValue(row[column.column_name])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination
                            currentPage={modelData.pagination.page}
                            totalPages={modelData.pagination.totalPages}
                        />
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">Aucune donnée disponible</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Format cell value based on content type
function formatCellValue(value: any): string {
    if (value === null || value === undefined) return "-";

    // Format date if it looks like a date
    if (
        value instanceof Date ||
        (typeof value === "string" &&
            value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))
    ) {
        return new Date(value).toLocaleString();
    }

    // Format boolean values
    if (typeof value === "boolean") {
        return value ? "Oui" : "Non";
    }

    // Format objects or arrays as JSON strings
    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
} 