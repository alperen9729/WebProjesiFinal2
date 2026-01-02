const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const mysql_2 = require("mysql2");
const session = require("express-session");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '../frontend')));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



app.use(session({
  secret: "key",
  resave: false,
  saveUninitialized: true
}));

const pool = mysql.createConnection({
    host: 'localhost',         
    user: 'admin',             
    password: '', 
    database: 'seyahat_planlayici',  
    waitForConnections: true,
    connectionLimit: 10
});

const db = mysql_2.createConnection({
  host: "localhost",
  user: "admin",
  password: "",  
  database: "seyahat_planlayici"
}); 


db.connect(err => {
  if (err) {
    console.error("MySQL bağlantı HATASI:", err);
  } else {
    console.log("Veritabanına bağlandı! ");
  }
});






app.get("/", (req, res) => {
      res.render("kayitol");
});

app.get("/cikis_yap",(req,res) => {

    req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Çıkış yapılamadı");
    }

    res.redirect("/");
  });


})



app.get("/oteller", (req, res) => {
  res.redirect("/SeyahatiniziPlanlayin/seyahat_planlama.html");
});



app.post("/api/otel-sec", async (req, res) => {
  const { hotel_id, hotel_isim, fiyat } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).send("Giriş yapılmamış");

  try {
   
    const sql1 = `
      UPDATE users
      SET hotel_id = ?, hotel_isim = ?, fiyat = ?
      WHERE id = ?
    `;

    await db.promise().query(sql1, [hotel_id, hotel_isim, fiyat, userId]);

   
    const [rows] = await db.promise().query("SELECT bos_oda FROM oteller WHERE id = ?", [hotel_id]);
  

    const bos_oda = rows[0].bos_oda;
   
    const sql2 = "UPDATE oteller SET bos_oda = ? WHERE id = ?";
    if(bos_oda > 0)
        await db.promise().query(sql2, [bos_oda - 1, hotel_id]);

    //res.send("Otel seçildi ve boş oda güncellendi");
      
  } catch (err) {
    console.error(err);
    res.status(500).send("DB hatası");
  }
});

app.post("/otel-sec", (req, res) => {
  const { otel_isim,otel_fiyat,otel_sehir } = req.body;

  res.redirect("/kiralanan_oda");
});

app.get("/kiralanan_oda", (req, res) => {
  const userId = req.session.userId;

  const sql = `
    SELECT o.*
    FROM users u
    JOIN oteller o ON u.hotel_id = o.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send("DB hatası");
    if (result.length === 0) {
      return res.render("sepet", { otel: null });
    }
    res.render("kiralanan_oda", { otel: result[0] });
  });
});




app.post('/api/kullanici-kayit', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Kullanıcı Adı ve Şifre zorunludur.');
    }

    try {
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await pool.execute(sql, [username, password]);
        
        console.log(`Yeni Kayıt: ${username}`);
        
        
        res.render('kayitol'); 

    } catch (error) {
        console.error('Kayıt Hatası:', error);
        let errorMessage = 'Kayıt sırasında bir hata oluştu.';
        
        if (error.code === 'ER_DUP_ENTRY') { 
            errorMessage = `'${username}' adı zaten alınmış.`;
        }

        res.status(500).send(`<h2>Hata!</h2><p>${errorMessage}</p><a href="/">Geri dön</a>`);
    }
});


app.post('/api/kullanici-giris', (req, res) => {
    const { username, password } = req.body;

    console.log('USERNAME:', username);
    console.log('PASSWORD:', password);

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    pool.query(sql, [username, password], (err, rows) => 
      { 
      if (err) 
      { 
          console.error(err); return res.status(500).send('Sunucu hatası'); 
      } 
      if (rows.length > 0) 
      { 

        req.session.userId = rows[0].id;
        res.sendFile(
              path.join(__dirname, '../frontend/Anasayfa/anasayfa.html')
           );
      } 
      else 
      {
         res.status(401).send('Hatalı giriş'); 
      }
    });
});

app.post('/api/admin-giris',async(req,res) => {
     const { username, password } = req.body;
     if(username == "" || password == "" || username != "admin" || password != "admin"){
      res.send("Hatali yönetici girişi!");
     }

     else{
         res.render("index.ejs")
     }
 

})



app.get("/otel_listele", (req, res) => {
  db.query("SELECT * FROM oteller", (err, result) => {
    res.render("otel_listele",{oteller : result});
  });
});

app.get("/kullanicilari_listele", (req,res) => {
    db.query("SELECT * FROM users", (err, result) => {
    res.render("kullanicilari_listele",{users : result});
  });

})


  app.get("/api/oteller", (req, res) => {
    db.query("SELECT * FROM oteller", (err, results) => {
      res.json(results);
    });
  });


app.get("/otel_ekle",(req,res) => {
    res.render("otel_ekle");
})

app.post("/otel_ekle", (req, res) => {

  const sehir = req.body.sehir;
  const otel = req.body.otel;
  const fiyat = req.body.fiyat;
  const bos_oda = req.body.bos_oda;
  const puan = req.body.puan;
 
  db.execute("INSERT INTO oteller (isim, sehir, fiyat, bos_oda, puan) values (?, ?, ?, ?, ?)", [otel, sehir, fiyat, bos_oda, puan], (err, result) => {
    
    if (err) {
      console.error("MYSQL HATASI 👉", err.message);
      console.error(err);
      return res.status(500).send(err.message);
    }
    

    res.render("index");
 
  });
});


app.post("/otel_sil", (req, res) => {

   const id = req.body.id;
   db.query("DELETE FROM oteller WHERE id = ?",[id]);
   res.redirect("/otel_listele");
    
});


app.listen(3005, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});