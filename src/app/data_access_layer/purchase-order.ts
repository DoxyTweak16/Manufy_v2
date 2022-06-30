export interface PurchaseOrder {
    $key : any,
    name : string,
    requester_id : string,
    requester_name : string,
    requester_username : string,
    approver : string,
    cost_center : number,
    date : Date,
    status : string,
    products : Map<string, number>,
    total_cost : number
}