const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin");


// MIDDLEWARE DE AUTENTICAÇÃO
function verificarAuth(req, res, next) {

  if (!req.session.usuario) {
    return res.redirect("/login");
  }

  next();

}


// PROTEGE TODAS AS ROTAS
router.use(verificarAuth);


// LISTAR MEMBROS
router.get("/membros", async (req, res) => {

  try {

    const snapshot =
      await db.collection("membros").get();

    const membros = [];

    snapshot.forEach(doc => {

      membros.push({
        id: doc.id,
        ...doc.data()
      });

    });

    res.render("admin/membros/index", {
      membros
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao buscar membros");

  }

});


// TELA CRIAR
router.get("/membros/criar", (req, res) => {
  res.render("admin/membros/criar");
});


// CRIAR MEMBRO
router.post("/membros/criar", async (req, res) => {

  try {

    const {
      nome,
      slug,
      foto,
      eixo,
      time,
      descricao,
      projetos,
      ativo,
      coordenador
    } = req.body;


    await db.collection("membros").add({

      nome,

      slug,

      foto,

      eixo,

      time,

      descricao,

      // ARRAY
      projetos:
        projetos
          ? projetos
              .split(",")
              .map(p => p.trim())
              .filter(p => p !== "")
          : [],

      // BOOLEAN
      ativo: ativo === "on",

      // ARRAY
      coordenador:
        coordenador
          ? coordenador
              .split(",")
              .map(c => c.trim())
              .filter(c => c !== "")
          : []

    });

    res.redirect("/admin/membros");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao criar membro");

  }

});


// TELA EDITAR
router.get("/membros/:id/editar", async (req, res) => {

  try {

    const doc =
      await db.collection("membros")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.send("Membro não encontrado");
    }

    const membro = {
      id: doc.id,
      ...doc.data()
    };

    res.render("admin/membros/editar", {
      membro
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao carregar membro");

  }

});


// EDITAR MEMBRO
router.post("/membros/:id/editar", async (req, res) => {

  try {

    const {
      nome,
      slug,
      foto,
      eixo,
      time,
      descricao,
      projetos,
      ativo,
      coordenador
    } = req.body;


    await db.collection("membros")
      .doc(req.params.id)
      .update({

        nome,

        slug,

        foto,

        eixo,

        time,

        descricao,

        // ARRAY
        projetos:
          projetos
            ? projetos
                .split(",")
                .map(p => p.trim())
                .filter(p => p !== "")
            : [],

        // BOOLEAN
        ativo: ativo === "on",

        // ARRAY
        coordenador:
          coordenador
            ? coordenador
                .split(",")
                .map(c => c.trim())
                .filter(c => c !== "")
            : []

      });

    res.redirect("/admin/membros");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao editar membro");

  }

});


// DELETAR MEMBRO
router.post("/membros/:id/deletar", async (req, res) => {

  try {

    await db.collection("membros")
      .doc(req.params.id)
      .delete();

    res.redirect("/admin/membros");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao deletar membro");

  }

});


module.exports = router;