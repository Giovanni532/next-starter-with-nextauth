import { getUserInfo } from "@/actions/auth";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ModelDataView } from "@/components/admin/ModelDataView";

type Params = { model: string };

interface SearchParams {
    page?: string;
    limit?: string;
}

export default async function AdminModelPage({
    params,
    searchParams
}: {
    params: Params,
    searchParams: SearchParams
}) {
    const model = params.model;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
    const user = await getUserInfo();

    if (!user || user.role !== "ADMIN") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Accès refusé</CardTitle>
                    <CardDescription>
                        Vous n'avez pas les droits pour accéder à cette page.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Encode user data as a base64 string for the authorization header
    const userToken = btoa(JSON.stringify({
        id: user.id,
        role: user.role
    }));

    // Fetch model data
    let modelData: any = {
        data: [],
        columns: [],
        pagination: { total: 0, page, limit, totalPages: 1 }
    };

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/models/${model}?page=${page}&limit=${limit}`;
        const response = await fetch(apiUrl, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });

        if (response.ok) {
            modelData = await response.json();
        } else {
            console.error("Erreur lors de la récupération des données:", await response.text());
        }
    } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
    }

    // Format model name for display (convert snake_case to Title Case)
    const formattedModelName = model
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    console.log("Model data length:",);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold">{formattedModelName}</h1>
                <p className="text-muted-foreground">
                    {modelData.data.length || 0} enregistrement{modelData.pagination?.total !== 1 ? 's' : ''} trouvé{modelData.pagination?.total !== 1 ? 's' : ''}
                </p>
            </div>

            <ModelDataView
                modelData={modelData}
                modelName={model}
                formattedModelName={formattedModelName}
            />
        </div>
    );
}
