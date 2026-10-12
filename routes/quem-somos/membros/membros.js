const express = require("express");
const router = express.Router();
const db = require("../../../services/firebaseAdmin");


router.get("/membros", async (req, res) => {
  try {
    const snapshot = await db.collection("membros").get();

    const membros = [];
    snapshot.forEach(doc => {
      membros.push(doc.data());
    });

    res.render("quem-somos/membros/index", { membros });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar membros");
  }
});


router.get("/membros/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const snapshot = await db.collection("membros")
      .where("slug", "==", slug)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Membro não encontrado");
    }

    const membro = snapshot.docs[0].data();

    res.render("quem-somos/membros/membro", { membro });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar membro");
  }
});

module.exports = router;
















