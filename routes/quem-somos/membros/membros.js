const express = require("express");
const router = express.Router();
const db = require("../../../services/firebaseAdmin"); 

router.get("/membros", async (req, res) => {
  try {
    const snapshot = await db.collection("membros").where("ativo", "==", true).get();
    
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

module.exports = router;