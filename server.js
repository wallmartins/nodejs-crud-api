/**
* 
* Arquivo: server.js
* Descrição: 
* Author: Wallace Martins
* Data de criação: 26/05/2021

*/

// Configurar o setup da App:

// Chamada dos pacotes
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Produto = require("./app/models/produto");

mongoose.promise = global.Promise;

// URI: MongoDB Atlas
mongoose.connect(
  "mongodb+srv://wallmartins:<password>@node-crud-api.1bmua.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Mandeira Local: MongoDb:
// mongoose.connect("mongodb://localhost:27017/node-crud-api", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Configuração da variável app para usar o 'BodyParser()':
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definindo uma porta onde será executada a API:
var port = process.env.port || 8000;

// Rotas da nossa API:
// ================================================================================

// Criando uma instância das Rotas via Express:
var router = express.Router();

router.use(function (req, res, next) {
  console.log("Algo está acontecendo aqui...");
  next();
});

// Rota de exemplo
router.get("/", function (req, res) {
  res.json({ message: "Beleza! Bem vindo(a) a nossa Loja XYZ" });
});

// API's:
// ================================================================================

// Rotas que terminarem com '/produtos' (servirão para: GET ALL & POST)
router
  .route("/produtos")

  /* 1) Método: Criar Produto (acessar em: POST http://localhost:8000/api/produtos) */

  .post(function (req, res) {
    var produto = new Produto();

    // Aqui vamos setar os campos do produto (via request)

    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.descricao = req.body.descricao;

    produto.save(function (error) {
      if (error) res.send("Erro ao tentar salvar o produto...:" + error);

      res.json({ message: "Produto cadastrado com sucesso" });
    });
  })

  /* 2) Método: Selecionar todos os Produtos (acessar em: GET http://localhost:8000/api/produtos) */

  .get(function (req, res) {
    Produto.find(function (error, produtos) {
      if (error)
        res.send("Erro ao tentar selecionar todos os produtos...:" + error);

      res.json(produtos);
    });
  });

// Rotas que irão terminar em '/produtos/:produto_id' (servirão tanto para: GET, PUT & DELETE: id)

router
  .route("/produtos/:produto_id")

  /* 3) Método: Selecionar por id: (Acessar em: GET http://localhost:8000/api/produtos/:produto_id) */

  .get(function (req, res) {
    // Função para selecionar um determinado produto por ID - irá verificar se caso não encontrar um determinado
    // produto pelo id... retorna uma mensagem de erro:
    Produto.findById(req.params.produto_id, function (error, produto) {
      if (error) res.send("Id do Produto não encontrado...:" + error);

      res.json(produto);
    });
  })

  /* 4) Método: Atualizar por id: (Acessar em: PUT http://localhost:8000/api/produtos/:produto_id) */

  .put(function (req, res) {
    // Primeiro: para conseguir atualizar, primeiro precisamos localizar o id do produto

    Produto.findById(req.params.produto_id, function (error, produto) {
      if (error) res.send("Id do Produto não encontrado...:" + error);

      // Segundo: atualizando os dados em cada uma das propriedades do produto

      produto.nome = req.body.nome;
      produto.preco = req.body.preco;
      produto.descricao = req.body.descricao;

      // Terceiro: agora que já atualizamos os dados, vamos salvar as propriedades

      produto.save(function (error) {
        if (error) res.send("Erro ao atualizar o produto...:" + error);

        res.json({ message: "Produto atualizado com sucesso!" });
      });
    });
  })

  /* 5) Método: Excluir por id: (Acessar em: DELETE http://localhost:8000/api/produtos/:produto_id) */

  .delete(function (req, res) {
    Produto.remove(
      {
        _id: req.params.produto_id,
      },
      function (error) {
        if (error) res.send("Id do produto não encontrado...:" + error);

        res.json({ message: "Produto excluído com sucesso!" });
      }
    );
  });

// Definindo um padrão das rotas prefixidadas com: '/api';
app.use("/api", router);

// Iniciando a aplicação (servidor)
app.listen(port);
console.log("iniciando a app na porta " + port);
