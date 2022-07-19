import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WoRepoService } from '../data_access_layer/wo-repo.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private wo_repo : WoRepoService) { }

  get_all_work_orders(queryString : string = '') {
    //VERIFICAR SE status E keywords NÃO SÃO NULOS OU UNDEFINED
    return this.wo_repo.getAll(queryString);
  }

  get_work_order(id : string) {
    return this.wo_repo.getWO(id);
  }

  woToInProgress(id : string, technician_username : string) {
    const newStatus = "In progress";
    this.wo_repo.updateWorkOrderStatus(id, {status: newStatus, owner: technician_username});
  }

  woToClosed(id: string, wo_data : any, technician_list : Array<string>) {
    const closeWorkOrderData = {
      summary: wo_data.maintenance_summary,
      status: "Closed",
    };

    //Se não for registada indisponibilidade, a mesma assume o valor "N/A" - Not assigned/Não atribuído
    if (wo_data.unavailabilityHours === "" && wo_data.unavailabilityMinutes === "") {
      closeWorkOrderData["asset_unavailability"] = "N/A";
    } else {
      //Colocar um 0 à esquerda sempre que as horas/minutos sejam menores que 10
      let hours   = (parseInt(wo_data.unavailabilityHours) < 10)   ? ('0' + wo_data.unavailabilityHours)   : (wo_data.unavailabilityHours);
      let minutes = (parseInt(wo_data.unavailabilityMinutes) < 10) ? ('0' + wo_data.unavailabilityMinutes) : (wo_data.unavailabilityMinutes);
      closeWorkOrderData["asset_unavailability"] = hours + "H" + minutes + "m";
    }

    //NOTA IMPORTANTE: O documento de cada OT contém um field tipo map chamado 'labor'. Nesse field devem constar entries tipo: "jcruz": "00:30", "mjoaquim":"02:30"
    //Adicionar mão-de-obra ao objeto
    let labor = {};

    for (let username of technician_list) {
      labor[username] = wo_data[username + "_hours"] + "H" + wo_data[username + "_minutes"] + "m";
    }

    closeWorkOrderData["labor"] = labor;
    this.wo_repo.updateWorkOrderStatus(id, closeWorkOrderData);
  }

}
