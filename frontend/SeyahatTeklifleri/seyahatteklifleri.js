document.addEventListener('DOMContentLoaded', () => {
    
    //Boostrapte Modal diye bir özellik var bu pop-up tarzı 
    //açılıp kapanabilen bir sayfa yapısı oluşturmaya yarar.

    const ModalBaslangic = document.getElementById('ModalBaslangic');
    //Bu Modaldan nesne türetmeliyim. Açılıp kapanma özelliği eklemem için şart
    
    const detayModal = new bootstrap.Modal(ModalBaslangic);
    
    const satinAlmaElementi = document.getElementById('ModalButonu');
    
    const satinAlmaModal = new bootstrap.Modal(satinAlmaElementi);

    
   
    
    const simdiRezerveEtButonu = ModalBaslangic.querySelector('.simdiRezerveEt'); 
   
    
    
   
    simdiRezerveEtButonu.addEventListener('click', () => {
     
       
     detayModal.hide();
     
        const satinAlmaModaliniGoster = () => {
            
            
            satinAlmaModal.show();
            
            ModalBaslangic.removeEventListener('hidden.bs.modal', satinAlmaModaliniGoster);
        };
        
        
        ModalBaslangic.addEventListener('hidden.bs.modal', satinAlmaModaliniGoster);
    });
    
    const rezervasyonButonlari = document.querySelectorAll('.btn-primary');

    //Burada Test Yaptım
    rezervasyonButonlari.forEach(deneme => {
        console.log(deneme);
    });
   

    rezervasyonButonlari.forEach(buton => {
        buton.addEventListener('click', (e) => {
            e.preventDefault(); 
            const tiklananKart = buton.closest('.card'); 
console.log(tiklananKart);
            if (tiklananKart) {
                const kartBasligi = tiklananKart.querySelector('.card-title').innerHTML;
              
                const kartGovdeIcerigi = tiklananKart.querySelector('.card-body').cloneNode(true);
                
                kartGovdeIcerigi.querySelector('.card-title').remove();
                kartGovdeIcerigi.querySelector('.btn-primary').remove();
                
                const modalBaslik = document.getElementById('ModalBasligi');
                const modalGovde = document.getElementById('ModalIcerigi');

                modalBaslik.innerHTML = kartBasligi;
                modalGovde.innerHTML = '';
                modalGovde.appendChild(kartGovdeIcerigi);
                
                
                detayModal.show();
            };
        });
    });

    

    // --- 4. Ödemeyi Tamamla Buton Aksiyonu ---
    const odemeyiTamamlaButonu = document.getElementById('OdemeBitir');
    
    odemeyiTamamlaButonu.addEventListener('click', (e) => {
       e.preventDefault();
        
        const form = satinAlmaElementi.querySelector('form');
        
        if (form.checkValidity()) {
             alert("Satın alma işleminiz başarıyla başlatıldı! Teşekkür ederiz.");
             satinAlmaModal.hide();
             
        
             satinAlmaElementi.addEventListener('hidden.bs.modal', () => {
                 console.log("Satın alma tamamlandı, modal temizlendi.");
             }, {once: true}); 
        } else {
             alert("Lütfen tüm zorunlu alanları doldurunuz.");
             
             form.classList.add('was-validated'); 
        };
       
    });

});

const kuponINput = document.getElementById("ModalKod");
const ModalKodButonu = document.getElementById("ModalKodButonu");

ModalKodButonu.addEventListener('click',function(){

if(ModalKod.value == "SEYAHAT10"){
    alert("İndirim Kodunuz Başarıyla kullanılmıştır!!!");
   
}else{
    alert("Geçersiz veya süresi dolmuş kod!!!");
};

});
