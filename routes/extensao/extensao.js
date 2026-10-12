const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin");

/*
// DADOS MOCK (temporário)
const extensoes = [
  {
    nome: "ACCS",
    slug: "accs",
    descricao: "ACCS"
  }
];


// LISTA DE PROJETOS DE EXTENSÃO
router.get("/extensao", (req, res) => {
  res.render("extensao/index", {
    extensoes
  });
});


// EXTENSÃO INDIVIDUAL
router.get("/extensao/:slug", (req, res) => {
  const slug = req.params.slug;

  const extensao = extensoes.find(e => e.slug === slug);

  if (!extensao) {
    return res.status(404).send("Extensão não encontrada!");
  }

  res.render("extensao/extensao", {
    extensao
  });
});
*/

router.get("/extensao", async (req, res) => {
  try {
    const snapshot = await db.collection("extensao").get();

    const extensoes = [];
    snapshot.forEach(doc => {
      extensoes.push(doc.data());
    });

    res.render("extensao/index", { extensoes });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar membros");
  }
});



router.get("/extensao/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const snapshot = await db.collection("extensao")
      .where("slug", "==", slug)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Extensao não encontrada");
    }

    const extensao = snapshot.docs[0].data();

    res.render("extensao/extensao", { extensao });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar extensao");
  }
});


module.exports = router;