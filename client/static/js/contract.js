const client_canva = document.getElementById("client-signature");

const sClient = client_canva ? new SignaturePad(client_canva) : null;




function clearSignature() {
    sClient?.clear();
}

function AcceptAndSign() {
   if (!sClient){
    return
   }

   const sig = sClient.toDataURL()
   if (sig.length < 3000){
    popup(1, "שם לב", "החתימה קצרה מדיי")
    sClient.clear();
    return
   }

    const on_success = (res) =>{
    if (!res.success){
        popup(1, res.title, res.notice)
        return
    }
    location.href = '/success'
   }

    const params = new URLSearchParams(location.search)
    const ctid = params.get("ctid")
    const cid = params.get("cid")
    const rid = params.get("rid")
    if (!ctid || !cid || !rid){
        popup(1, "שגיאה", "פרטי החוזה חסרים או לא תקינים")
        return
    }

    const data = {
        signature: sig,
        ctid: ctid,
        cid: cid,
        rid: rid
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


