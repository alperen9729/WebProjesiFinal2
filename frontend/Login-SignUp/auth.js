// Kullanıcı Mod Değiştirme (Giriş ↔ Kayıt)
let isLoginMode = true; // Başlangıç: giriş modu


function toggleMode() {
    isLoginMode = !isLoginMode;


    document.getElementById("form-title").innerText =
        isLoginMode ? "Giriş Yap" : "Kayıt Ol";


    document.getElementById("actionBtn").innerText =
        isLoginMode ? "Giriş Yap" : "Kayıt Ol";


    document.getElementById("toggleText").innerHTML =
        isLoginMode
        ? `Hesabın yok mu? <a href="#" onclick="toggleMode()">Kayıt Ol</a>`
        : `Zaten hesabın var mı? <a href="#" onclick="toggleMode()">Giriş Yap</a>`;
}


// Giriş / Kayıt İşlemi
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();


    if (!username || !password) {
         return alert("Kullanıcı adı ve şifre boş olamaz.");
    }

    // Kayıt modu
    if (!isLoginMode) {
        if (localStorage.getItem("user_" + username)) {
            return alert("Bu kullanıcı zaten kayıtlı.");
            }


        const userData = {
            username,
            password
        };


        localStorage.setItem("user_" + username, JSON.stringify(userData));
        localStorage.setItem("loggedUser", username);


        alert("Kayıt başarılı!");
        window.location.href = "../Anasayfa/anasayfaindex.html";
        return;
    }


    // Giriş modu
    const data = localStorage.getItem("user_" + username);
    if (!data) {
        return alert("Kullanıcı bulunamadı!");
    }


    const user = JSON.parse(data);


    if (user.password !== password) {
        return alert("Şifre yanlış!");
    }


    localStorage.setItem("loggedUser", username);
    alert("Giriş başarılı!");
    window.location.href = "../Anasayfa/anasayfaindex.html";
}


// Navbar'da kull. adi gosterme
function showLoggedUser() {
    const user = localStorage.getItem("loggedUser");


    const display = document.getElementById("userDisplay");
    const loginNav = document.getElementById("loginNav");
    const logoutBtn = document.getElementById("logoutBtn");


    // Kullanıcı yok - Giriş gösterilsin
    if (!user) {
        if (display) display.innerText = "";
        if (logoutBtn) logoutBtn.style.display = "none";
    if (loginNav) loginNav.style.display = "inline-block";
        return; 
    }


    // Kullanıcı varsa - Adını göster
    if (display) display.innerText = "Hoşgeldin, " + user;
    if (loginNav) loginNav.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";


    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("loggedUser");
            alert("Çıkış yaptınız!");
            window.location.href = "../Login-SignUp/login-register.html";
        };
    }
}

document.addEventListener("DOMContentLoaded", showLoggedUser);
