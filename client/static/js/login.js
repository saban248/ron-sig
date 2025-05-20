


function login(){
    
    const on_success = (data) =>{
        if (!data.success){
            loading(0);
        }
        else{
            setTimeout(() => {window.location = "/home";}, 1000);
        }
        popup(1, data.title, data.notice)
    }
    username = document.getElementById("user").value;
    password = document.getElementById("password").value;
    nonce = document.getElementById("n0nce").textContent;
    const data = {user:username, password:password, nonce:nonce};

    do_api(RouteApi.auth, data, on_success)

    
}