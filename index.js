const startSetup = require('./appSetup.js');
let sql = "";
let noteNumber = "";
let session = "";

startSetup.app.get('/', (req, res) => {
    session = req.session;
    if(session.userid){
        res.redirect("/notes");
    }else {    
        res.render("home");
    }
    });

    startSetup.app.post('/logIn',(req, res)=>{
        const { username, password } = req.body;
        session = req.session;

        sql=`SELECT * FROM Cuentas WHERE Usuario = "${username}" AND Contraseña = "${password}" `;
        startSetup.con.query(sql,(err, result)=>{
        if (err) throw err
        if(result.length > 0){
            session.userid = result[0].ID;
            session.username = result[0].Usuario;
            res.redirect("/notes");
            } else {
                res.redirect("/");
            }
        });
    });

    
    startSetup.app.get("/signUp", (req, res)=>{
        session = req.session;
        if(session.userid){
            res.redirect("/notes");
        }else{
            res.render("signup");
        }  
        });
    

        startSetup.app.post("/signUp", (req, res)=>{
        const { username, password } = req.body;
        session = req.session;

        sql=`SELECT * FROM Cuentas WHERE Usuario = "${username}" AND Contraseña= "${password}"`;
        startSetup.con.query(sql,(err, result)=>{
        if(err) throw err
        if(result.length > 0){
        res.redirect("/");
        } else {

        sql=`INSERT INTO Cuentas (Usuario, Contraseña) VALUES ("${username}", "${password}")`;
        startSetup.con.query(sql,(err, result)=>{
        if (err) throw err
        
        sql =`SELECT * FROM Cuentas WHERE Usuario ="${username}" AND Contraseña ="${password}"`;
        startSetup.con.query(sql,(err, result)=>{
        if(err) throw err
        session.userid = result[0].ID;
        res.redirect("/");
        });
        });
        }
        }); 
        });

        startSetup.app.get('/notes', (req, res) => {
            session = req.session;
            if(session.userid){
                sql = `SELECT * FROM Notas WHERE ID = ${session.userid}`;
                startSetup.con.query(sql,(err, results, fields)=>{
                    if(err) throw err;
                    res.render("notes",{results:results, Usuario:session.username});
                });     
            }else {    
            res.redirect("/");
        }
        });

        startSetup.app.get('/form', (req, res) => {
            session = req.session;
            if(session.userid){
            res.render("form");
            }else {    
                res.redirect("/");
            }
        });

        startSetup.app.post("/form",(req, res)=>{
            session = req.session;
            let {title, content} = req.body;
            
            if(!(session.userid)) res.redirect("/");
            
            sql=`INSERT INTO Notas (ID, Titulo, Contenido) VALUES (${session.userid}, "${title}", "${content}")`;
            startSetup.con.query(sql,(err, results, fields)=>{
            if (err) throw err
            res.redirect("/notes");
            });         
        });

        startSetup.app.get("/seeNote/:number",(req, res)=>{
        noteNumber = req.query.number;
        sql = `SELECT * FROM Notas WHERE Numero = ${noteNumber}`;

        startSetup.con.query(sql, (err, results, fields)=>{
        if(err) throw err;
        res.render("form2",{result:results[0]});
        });
        });

        startSetup.app.post("/update",(req, res)=>{
        let {title, content, id}= req.body;

        sql = `UPDATE Notas SET Titulo = '${title}', Contenido='${content}' WHERE ID ='${session.userid }' AND Numero ='${id}'`;

        startSetup.con.query(sql,(err, results, fields)=>{
        if(err) throw err;
        res.redirect("/");
        });
        });

        startSetup.app.get("/delete/:numero",(req, res)=>{
            noteNumber = req.query.numero;

            sql = `DELETE FROM Notas WHERE Numero = ${noteNumber}`;

            startSetup.con.query(sql, (err, results, fields)=>{
            if(err) throw err;
            res.redirect("/");
            });
        });

        startSetup.app.get("/logOut",(req, res)=>{
            req.session.destroy();
            res.redirect("/");
        });

    startSetup.app.listen(startSetup.port, () => {
    console.log(`Example app listening on port ${startSetup.port}`);
    });