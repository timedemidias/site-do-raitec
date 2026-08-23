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


/* Função pra gerar slug a partir do nome
 function gerarSlug(texto) {
   return texto
     .toString()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase()
     .trim()
     .replace(/[^a-z0-9\s-]/g, "")
     .replace(/\s+/g, "-")
     .replace(/-+/g, "-");
 } */ 


// LISTAR NOTÍCIAS
router.get("/noticias", async (req, res) => {

  try {

    const snapshot =
      await db.collection("noticias").get();

    const noticias = [];

    snapshot.forEach(doc => {

      noticias.push({
        id: doc.id,
        ...doc.data()
      });

    });

    res.render("admin/noticias/index", {
      noticias
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao buscar notícias");

  }

});


// TELA CRIAR
router.get("/noticias/criar", (req, res) => {
  res.render("admin/noticias/criar");
});


// CRIAR NOTÍCIA
router.post("/noticias/criar", async (req, res) => {

  try {

    const {
      nome,
      slug,
      imagem,
      descricao,
      conteudo
    } = req.body;

    const hoje = new Date();
    const data = hoje.toLocaleDateString("pt-BR");

    await db.collection("noticias").add({

      nome,

      slug,

      data,

      imagem,

      descricao,

      conteudo

    });

    res.redirect("/admin/noticias");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao criar notícia");

  }

});


// TELA EDITAR
router.get("/noticias/:id/editar", async (req, res) => {

  try {

    const doc =
      await db.collection("noticias")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.send("Notícia não encontrada");
    }

    const noticia = {
      id: doc.id,
      ...doc.data()
    };

    res.render("admin/noticias/editar", {
      noticia
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao carregar notícia");

  }

});


// EDITAR NOTÍCIA
router.post("/noticias/:id/editar", async (req, res) => {

  try {

    const {
      nome,
      slug,
      imagem,
      descricao,
      conteudo
    } = req.body;

    await db.collection("noticias")
      .doc(req.params.id)
      .update({

        nome,

        slug,

        imagem,

        descricao,

        conteudo

      });

    res.redirect("/admin/noticias");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao editar notícia");

  }

});


// DELETAR NOTÍCIA
router.post("/noticias/:id/deletar", async (req, res) => {

  try {

    await db.collection("noticias")
      .doc(req.params.id)
      .delete();

    res.redirect("/admin/noticias");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao deletar notícia");

  }

});


module.exports = router;


