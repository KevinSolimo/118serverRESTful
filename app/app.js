/*
 * server: accetta le richieste in formato REST dai vari client,
 * accede al database MongoDB, effettua le operazioni CRUD e rispedisce
 * al client il risultato. 
 * Se attivo sullo stesso server del client, 
 * deve essere in ascolto su una porta diversa (in questo caso 9000):
 * modificare nel command il PreviewURL in http://${server.port.9000}
 * 
 * 
 * E' un server web che però accetta solo 
 * richieste di un certo tipo e fornisce risultati in formato JSON
 * 
 * richieste accettate:
 * 
 * /info - tutti i document presenti
 * /infoAnno/:anno - document relativi all'anno
 * /infoTipo/:tipo - document relativi al tipo di intervento
 * /infoAnnoTipo/:anno/:tipo - document relativi all'anno e ad un certo tipo di intervento
 * 
 * /insertInfo - inserisce un nuovo document con info passate nel body
 * /updateInfo/:anno/:tipo/:codRosso/:codGiallo/:codBianco/:codVerde - aggiorna il document anno/tipoIntervento con i dati relativi alle tipologie di intervento
 * /deteteInfo/:anno/:tipo - elimina il document indicato da anno e tipo
 * 
 * Per provarlo è necessario utilizzare dei plug-in per i vari browser o dei siti per testare le API come
 * https://apitester.com
 * 
 * Ricordarsi che per provare a inviare delle informazioni tramite POST, bisogna usare per il body
 * una sintassi come la seguente:
 * 
 * anno=2019&tipo=Incidenti%20stradali
 * 
 */

var express = require('express');
var app = express();

/* 
 * la parte riguardante pug è inutile perché le informazioni non verranno
 * formattate in html per un utente reale
 * 
 * app.set('views', './views');
 * app.set('view engine', 'pug');
 *
 */

var MongoClient = require('mongodb').MongoClient;

// per gestire le richieste POST:
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.send({message: 'WebService RESTful'});
});

// Read
app.get('/info', function (req, res) {
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Interventi118").find().sort({anno:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.send(result);
        db.close();
      });
    });
});

app.get('/infoAnno/:anno', function (req, res) {
    var anno = parseInt(req.params.anno);
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Interventi118").find({anno: anno}).sort({anno:1}).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        res.send(result);
        db.close();
      });
    });
});

app.get('/infoTipo/:tipo', function (req, res) {
    // inserire qui il codice
});

app.get('/infoAnnoTipo/:anno/:tipo', function (req, res) {
    // inserire qui il codice
});

// Create
app.post('/insertInfo', function (req, res) {
    
    if(!req.body.anno) {
        return res.status(400).send({
            success: 'false',
            message: 'anno is required'
        });
    } 
    else 
        if(!req.body.tipo) {
            return res.status(400).send({
                success: 'false',
                message: 'tipo is required'
            });
    }

    var anno = parseInt(req.body.anno);
    var tipo = req.body.tipo;
    
    var codRosso = parseInt(req.body.codRosso);
    var codGiallo = parseInt(req.body.codGiallo);
    var codBianco = parseInt(req.body.codBianco);
    var codVerde = parseInt(req.body.codVerde);

    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      var newInfo = { anno: anno, InterventoTipo: tipo, CodiceRosso: codRosso, CodiceGiallo:codGiallo, CodiceBianco: codBianco, CodiceVerde: codVerde};
      dbo.collection("Interventi118").insertOne(newInfo, function(err, result) {
        if (err) throw err;
        res.send({n: result.result.n})
        db.close();
      });
    });

});

//Update
app.put('/updateInfo/:anno/:tipo/:codRosso/:codGiallo/:codBianco/:codVerde', function (req, res) {
    var anno = parseInt(req.params.anno);
    var tipo = req.params.tipo;
    
    var codRosso = parseInt(req.params.codRosso);
    var codGiallo = parseInt(req.params.codGiallo);
    var codBianco = parseInt(req.params.codBianco);
    var codVerde = parseInt(req.params.codVerde);

    
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      var myInfo = { anno: anno, InterventoTipo: tipo};
      var newData = { $set: {CodiceRosso: codRosso, CodiceGiallo:codGiallo, CodiceBianco: codBianco, CodiceVerde: codVerde} }; 
      dbo.collection("Interventi118").updateOne(myInfo, newData, function(err, result) {
        if (err) throw err;
        res.send({n: result.result.n})
        db.close();
      });
    });

});

//Delete
app.delete('/deleteInfo/:anno/:tipo', function (req, res) {
    // inserire qui il codice    
});

app.listen(9000, function () {
    console.log('Example app listening on port 9000!');
});
