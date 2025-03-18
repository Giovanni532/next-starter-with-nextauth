import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ model: string }> }
) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');

        // Check if authorization header exists and is in proper format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Extract and validate user data from token
        try {
            const userData = JSON.parse(atob(authHeader.split(' ')[1]));

            // Verify user has ADMIN role
            if (userData?.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Accès non autorisé" },
                    { status: 403 }
                );
            }

            const model = (await params).model;
            const url = new URL(request.url);
            const page = parseInt(url.searchParams.get('page') || '1');
            const limit = parseInt(url.searchParams.get('limit') || '10');
            const skip = (page - 1) * limit;

            // Vérifier si le modèle est valide avant de faire la requête
            const tableInfo = await prisma.$queryRaw`
                SELECT tablename 
                FROM pg_catalog.pg_tables
                WHERE schemaname = 'public' AND tablename = ${model}
            `;

            if (!(tableInfo as any[]).length) {
                return NextResponse.json(
                    { error: "Modèle non trouvé" },
                    { status: 404 }
                );
            }

            // Récupérer le nombre total d'enregistrements
            const totalCount = Number(
                await prisma.$executeRawUnsafe(`SELECT COUNT(*) FROM "${model}"`)
            );

            // Récupérer les données avec pagination
            const data = await prisma.$queryRawUnsafe(
                `SELECT * FROM "${model}" LIMIT ${limit} OFFSET ${skip}`
            );

            // Récupérer les colonnes/schéma de la table
            const columns = await prisma.$queryRawUnsafe(`
                SELECT column_name, data_type, character_maximum_length,
                    column_default, is_nullable
                FROM information_schema.columns
                WHERE table_name = '${model}'
                ORDER BY ordinal_position
            `);

            return NextResponse.json({
                success: true,
                model,
                data,
                columns,
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
                }
            });

        } catch (e) {
            console.error("Error processing request:", e);
            return NextResponse.json(
                { error: "Token invalide ou erreur de traitement" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Une erreur est survenue lors de la récupération des données."
            },
            { status: 500 }
        );
    }
} 