export interface PurchaseOrder {
    $key : any;
    name : string;
    requester_id : string;
    requester_name : string;
    requester_username : string;
    work_order : string;
    wo_title : string;
    approver : string;
    cost_center : number;
    date : any;
    decision_date : any;
    status : string;
    num_items : number;
    products : Map< string, any >;
    total_cost : number;
}