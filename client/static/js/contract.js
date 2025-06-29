const client_canva = document.getElementById("client-signature");

const sClient = new SignaturePad(client_canva);




function clearSignature() {
    sClient.clear();
}

function AcceptAndSign() {
   const sig = sClient.toDataURL()
   if (sig.length < 4000){
    popup(1, "שם לב", "החתימה קצרה מדיי")
    sClient.clear();
    return
   }

   on_success = (res) =>{
    if (!res.success){
        popup(1, res.title, res.notice)
    }
    location.href = '/success'
   }
    const  [unknown, ctid, cid, rid] = location.href.split("?")[1].split("=");
    const data = {
        signature:sig,
        ctid:ctid.replace("&cid", ""),cid:cid.replace("&rid", ""), rid:rid
   }


   do_api('/do_contract', data, on_success)
}


function do_api(route, data, success, err){
    $.ajax({
        url:route,
        type:"POST",
        contentType: 'application/json',
        data:JSON.stringify(data),
        success:(res) =>{
            success(res);
            loading(0);
        },
        error:(xhr) => {
            loading(0);
            err?err(xhr):undefined

        }
    })

}


