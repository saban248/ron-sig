


function get_all_clients(){
    var clients = ManagerCache.getListClients();
    if (clients)return clients;

    on_success = (res) =>{
        if (!res.success){
            popup(1, res.title, res.notice);
        }

        const clients = res.clients;
        ManagerCache.setListClients(clients)

    }

    do_api(RouteApi.ListClients,{}, on_success);

}

