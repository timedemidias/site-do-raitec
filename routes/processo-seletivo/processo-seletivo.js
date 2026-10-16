const express = require("express");
const router = express.Router();

const EDICAO = "2026.2";
const DATA_LIMITE = "2026-10-15T23:59:59-03:00"; // fim da contagem regressiva

// Cronograma
router.get("/processo-seletivo", (req, res) => {
  res.render("processo-seletivo/processo-seletivo", {
    edicao: EDICAO,
    dataLimite: DATA_LIMITE,
  });
});

// Informações de cada etapa
router.get("/processo-seletivo/informacoes", (req, res) => {
  res.render("processo-seletivo/informacoes");
});

// Aprovados
router.get("/processo-seletivo/aprovados", async (req, res) => {
  // TODO: trocar pela consulta ao banco de dados.
  // "foto" é só o nome do arquivo, dentro de public/images/aprovados/
  const aprovados = [
    { nome: "Fulano de Tal", eixo: "Eixo Inovação Educacional", time: "Time de Mídias", foto: "aprovado-1.png" },
    { nome: "Fulano de Tal", eixo: "Eixo Técnico Sustentável", time: "Time de Process", foto: "aprovado-2.png" },
    { nome: "Fulano de Tal", eixo: "Eixo Tecnologias e Saúde", time: "Time de Mídias", foto: "aprovado-3.png" },
  ];

  res.render("processo-seletivo/aprovados", { aprovados, edicao: EDICAO });
});

module.exports = router;