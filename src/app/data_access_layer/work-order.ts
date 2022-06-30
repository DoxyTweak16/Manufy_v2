export interface WorkOrder {
    $key: any;
    asset: string;
    asset_desc: string;
    asset_location: string;
    asset_unavailability: number;
    date: string;
    description: string;
    images: [string];
    labor: Map<string, number>;
    reporter_name: string;
    reporter_phone: string;
    status: string;
    summary: string;
    title: string;
    owner: string;
    sector: string;
}
