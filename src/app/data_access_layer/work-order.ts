export interface WorkOrder {
    $key: any;
    asset: string;
    asset_name: string;
    asset_location: string;
    asset_unavailability: string;
    asset_img: any;
    date: any;
    description: string;
    images: [string];
    labor: Map<string, string>;
    reporter_name: string;
    reporter_phone: string;
    status: string;
    summary: string;
    title: string;
    owner: string;
    sector: string;
}
