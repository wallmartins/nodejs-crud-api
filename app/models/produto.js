/**
 *
 * Arquivo: produto.js
 * Author: Wallace Martins
 * Descrição: arquivo responsável onde trataremos o modelo da classe Produto
 * Data: 26/05/2021
 *
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Produto:
 *
 * -> id: int
 * -> Nome: string
 * -> Preço: number
 * -> Descrição: string
 *
 */

var ProdutoSchema = new Schema({
  nome: String,
  preco: Number,
  descricao: String,
});

module.exports = mongoose.model("Produto", ProdutoSchema);
