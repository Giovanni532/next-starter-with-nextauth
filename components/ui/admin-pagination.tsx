"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    modelName: string;
}

export function AdminPagination({
    currentPage,
    totalPages,
    modelName,
}: AdminPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return null;
    }

    // Create page URL with existing query params preserved
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Create pagination items
    const paginationItems = [];

    // Determine which pages to display based on current position
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // Adjust for edge cases
    if (endPage - startPage < 2 && totalPages > 2) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, 3);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - 2);
        }
    }

    // First page always visible
    paginationItems.push(
        <PaginationItem key="first">
            <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                asChild={currentPage !== 1}
                disabled={currentPage === 1}
            >
                {currentPage !== 1 ? (
                    <Link href={createPageUrl(1)}>1</Link>
                ) : (
                    <span>1</span>
                )}
            </Button>
        </PaginationItem>
    );

    // Ellipsis after first page
    if (startPage > 2) {
        paginationItems.push(
            <PaginationItem key="ellipsis-start">
                <PaginationEllipsis />
            </PaginationItem>
        );
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages && i > 1) {
            paginationItems.push(
                <PaginationItem key={i} className="hidden md:inline-block">
                    <Button
                        variant={currentPage === i ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        asChild={currentPage !== i}
                        disabled={currentPage === i}
                    >
                        {currentPage !== i ? (
                            <Link href={createPageUrl(i)}>{i}</Link>
                        ) : (
                            <span>{i}</span>
                        )}
                    </Button>
                </PaginationItem>
            );
        }
    }

    // Ellipsis before last page
    if (endPage < totalPages - 1) {
        paginationItems.push(
            <PaginationItem key="ellipsis-end">
                <PaginationEllipsis />
            </PaginationItem>
        );
    }

    // Last page (if not the same as first page)
    if (totalPages > 1) {
        paginationItems.push(
            <PaginationItem key="last">
                <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    asChild={currentPage !== totalPages}
                    disabled={currentPage === totalPages}
                >
                    {currentPage !== totalPages ? (
                        <Link href={createPageUrl(totalPages)}>{totalPages}</Link>
                    ) : (
                        <span>{totalPages}</span>
                    )}
                </Button>
            </PaginationItem>
        );
    }

    return (
        <Pagination className="mt-6">
            <PaginationContent className="flex flex-wrap justify-center gap-1">
                <PaginationItem>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        asChild={currentPage > 1}
                        disabled={currentPage <= 1}
                        aria-label="Page précédente"
                    >
                        {currentPage > 1 ? (
                            <Link href={createPageUrl(currentPage - 1)}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Page précédente</span>
                            </Link>
                        ) : (
                            <span>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Page précédente</span>
                            </span>
                        )}
                    </Button>
                </PaginationItem>

                {paginationItems}

                <PaginationItem>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        asChild={currentPage < totalPages}
                        disabled={currentPage >= totalPages}
                        aria-label="Page suivante"
                    >
                        {currentPage < totalPages ? (
                            <Link href={createPageUrl(currentPage + 1)}>
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Page suivante</span>
                            </Link>
                        ) : (
                            <span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Page suivante</span>
                            </span>
                        )}
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
} 