export interface PurchaseOrder {
    $key : any,
    name : string,
    requester_id : string,
    requester_name : string,
    requester_username : string,
    work_order : string,
    wo_title : string,
    approver : string,
    cost_center : number,
    date : Date,
    status : string,
    num_items : number,
    products : Map< string, any >,
    total_cost : number
}