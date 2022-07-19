export interface Asset {
    $key : any;
    name : string;
    state: string;
    location : string;
    location_desc: string;
    location_history : [Map< string, any >];
    img : any;
    sector_desc : string;
}