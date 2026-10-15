
const express = require("express");
const router = express.Router();

const db = require("../../services/firebaseAdmin");

// ==========================================
// LISTA DE NOTÍCIAS
// GET /noticias
// ==========================================
router.get("/noticias", async (req, res) => {
  try {
    const busca = (req.query.busca || "").trim();

    const snapshot = await db.collection("noticias").get();

    let noticias = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Pesquisa por nome ou descrição
    if (busca) {
      const termo = busca.toLowerCase();

      noticias = noticias.filter(noticia => {
        const nome = (noticia.nome || "").toLowerCase();
        const descricao = (noticia.descricao || "").toLowerCase();

        return nome.includes(termo) ||
               descricao.includes(termo);
      });
    }

    // Ordena da mais recente para a mais antiga
    noticias.sort((a, b) => {
      const converterData = valor => {
        if (valor?.toDate) {
          return valor.toDate().getTime();
        }

        if (!valor) {
          return 0;
        }

        // Aceita datas do Firestore e datas em texto
        const data = new Date(valor).getTime();
        return Number.isNaN(data) ? 0 : data;
      };

      return converterData(b.data) - converterData(a.data);
    });

    return res.render("noticias/index", {
      noticias,
      busca
    });

  } catch (erro) {
    console.error("Erro ao buscar notícias:", erro);
    return res.status(500).send("Erro ao buscar notícias.");
  }
});

// ==========================================
// NOTÍCIA INDIVIDUAL
// GET /noticias/:slug
// ==========================================
router.get("/noticias/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Busca a notícia exclusivamente pelo slug
    const snapshot = await db.collection("noticias")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Notícia não encontrada.");
    }

    const documento = snapshot.docs[0];

    const noticia = {
      ...documento.data()
    };

    // Busca todas as notícias para montar a seção
    // de outras notícias, excluindo a notícia atual
    const todasSnapshot = await db.collection("noticias").get();

    const outrasNoticias = todasSnapshot.docs
      .filter(doc => doc.id !== documento.id)
      .map(doc => ({
        ...doc.data()
      }));

    // Ordena pelas mais recentes, quando houver data
    outrasNoticias.sort((a, b) => {
      const converterData = valor => {
        if (valor?.toDate) {
          return valor.toDate().getTime();
        }

        if (!valor) {
          return 0;
        }

        const data = new Date(valor).getTime();
        return Number.isNaN(data) ? 0 : data;
      };

      return converterData(b.data) - converterData(a.data);
    });

    // Renderiza a página individual
    return res.render("noticias/noticia", {
      noticia,
      outrasNoticias
    });

  } catch (erro) {
    console.error("Erro ao buscar notícia individual:", erro);
    return res.status(500).send("Erro ao abrir notícia.");
  }
});

module.exports = router;
