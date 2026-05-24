const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin");

router.get("/raipedia", async (req, res) => {
  try {
    const snapshot = await db.collection("raipedia").get();

    const raipedia = [];
    snapshot.forEach(doc => {
      raipedia.push(doc.data());
    });

    res.render("raipedia/index", { raipedia });

  } 
  catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar Raipédia");
  }
});

router.get("/raipedia/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const snapshot = await db.collection("raipedia")
      .where("slug", "==", slug)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Artigo não encontrado!");
    }

    const raipedia = snapshot.docs[0].data();

    if (raipedia.categoria === "microcontroladores") {
      return res.render("raipedia/capacitacoes/microcontroladores", { raipedia });
    }

    res.render("raipedia/raipedia", { raipedia });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar artigo!");
  }
});

module.exports = router;