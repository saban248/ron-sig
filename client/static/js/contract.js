const client_canva = document.getElementById("client-signature");
const sClient = new SignaturePad(client_canva);



function clearSignature() {
    sClient.clear();
}

function AcceptAndSign() {
   const sig = sClient.toDataURL()
   if (sig.length < 7000){
    popup(1, "שם לב", "החתימה קצרה מדיי")
    sClient.clear();
    return
   }
}


