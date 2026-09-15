
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


/* ========================================
   HELPERS DE CONVERSÃO (texto <-> dados)
======================================== */

// "a, b, c" -> ["a", "b", "c"]
function paraLista(texto) {

  return texto
    ? texto
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "")
    : [];

}

// ["a", "b", "c"] -> "a, b, c"
function listaParaTexto(lista) {
  return Array.isArray(lista) ? lista.join(", ") : "";
}

// "nome | cargo | link\nnome2 | cargo2 | link2" -> [{nome, cargo, link}, ...]
// aceita também so o nome (sem "|"), virando {nome} (compatível com o formato antigo em string)
function paraMembros(texto) {

  if (!texto) return [];

  return texto
    .split("\n")
    .map(linha => linha.trim())
    .filter(linha => linha !== "")
    .map(linha => {

      const partes = linha.split("|").map(p => p.trim());

      const membro = { nome: partes[0] };

      if (partes[1]) membro.cargo = partes[1];
      if (partes[2]) membro.link = partes[2];

      return membro;

    });

}

// [{nome, cargo, link}, ...] ou ["nome", ...] -> texto pro textarea
function membrosParaTexto(membros) {

  if (!Array.isArray(membros)) return "";

  return membros
    .map(membro => {

      if (typeof membro === "string") return membro;

      return [membro.nome, membro.cargo, membro.link]
        .filter(parte => parte !== undefined && parte !== null && parte !== "")
        .join(" | ");

    })
    .join("\n");

}

// "titulo | descricao" por linha -> [{titulo, descricao}, ...]
function paraFluxo(texto) {

  if (!texto) return [];

  return texto
    .split("\n")
    .map(linha => linha.trim())
    .filter(linha => linha !== "")
    .map(linha => {

      const [titulo, descricao] = linha.split("|").map(p => p.trim());

      return {
        titulo: titulo || "",
        descricao: descricao || ""
      };

    });

}

function fluxoParaTexto(fluxo) {

  if (!Array.isArray(fluxo)) return "";

  return fluxo
    .map(passo => `${passo.titulo || ""} | ${passo.descricao || ""}`)
    .join("\n");

}

// "nome | quantidade | descricao | funcao | preco" por linha -> [{...}, ...]
function paraComponentes(texto) {

  if (!texto) return [];

  return texto
    .split("\n")
    .map(linha => linha.trim())
    .filter(linha => linha !== "")
    .map(linha => {

      const partes = linha.split("|").map(p => p.trim());

      const componente = { nome: partes[0] || "" };

      if (partes[1]) componente.quantidade = isNaN(Number(partes[1])) ? partes[1] : Number(partes[1]);
      if (partes[2]) componente.descricao = partes[2];
      if (partes[3]) componente.funcao = partes[3];
      if (partes[4]) componente.preco = partes[4];

      return componente;

    });

}

function componentesParaTexto(componentes) {

  if (!Array.isArray(componentes)) return "";

  return componentes
    .map(c => [c.nome, c.quantidade, c.descricao, c.funcao, c.preco]
      .map(v => v === undefined || v === null ? "" : v)
      .join(" | "))
    .join("\n");

}

// "nome | tipo | descricao" por linha -> [{...}, ...]
function paraTecnologias(texto) {

  if (!texto) return [];

  return texto
    .split("\n")
    .map(linha => linha.trim())
    .filter(linha => linha !== "")
    .map(linha => {

      const partes = linha.split("|").map(p => p.trim());

      const tecnologia = { nome: partes[0] || "" };

      if (partes[1]) tecnologia.tipo = partes[1];
      if (partes[2]) tecnologia.descricao = partes[2];

      return tecnologia;

    });

}

function tecnologiasParaTexto(tecnologias) {

  if (!Array.isArray(tecnologias)) return "";

  return tecnologias
    .map(t => [t.nome, t.tipo, t.descricao]
      .map(v => v === undefined || v === null ? "" : v)
      .join(" | "))
    .join("\n");

}


// "Projeto Legal!" -> "projeto-legal"
function slugify(texto) {

  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .replace(/\s+/g, "-") // espaços viram hífen
    .replace(/-+/g, "-"); // remove hífens duplicados

}


// MONTA O OBJETO DO PROJETO A PARTIR DO req.body
function montarProjeto(body) {

  const {
    nome,
    slug,
    status,
    eixoTecnico,
    objetivo,
    descricao,
    problema,
    justificativa,
    funcionamento,
    logica,
    custoTotal,
    resultados,
    video,
    data,
    duracao,
    linkDoc,
    linkGithub,
    imagens,
    linguagens,
    melhorias,
    aplicacoes,
    membros,
    fluxo,
    componentes,
    tecnologias
  } = body;

  return {

    nome,

    slug,

    // SELECT
    status,

    eixoTecnico,

    objetivo,

    descricao,

    problema,

    justificativa,

    funcionamento,

    logica,

    custoTotal,

    resultados,

    video,

    data,

    duracao,

    linkDoc,

    linkGithub,

    // ARRAYS SIMPLES
    imagens: paraLista(imagens),

    linguagens: paraLista(linguagens),

    melhorias: paraLista(melhorias),

    aplicacoes: paraLista(aplicacoes),

    // ARRAY DE OBJETOS
    membros: paraMembros(membros),

    fluxo: paraFluxo(fluxo),

    componentes: paraComponentes(componentes),

    tecnologias: paraTecnologias(tecnologias)

  };

}


/* ========================================
   ROTAS
======================================== */

// LISTAR PROJETOS
router.get("/projetos", async (req, res) => {

  try {

    const snapshot =
      await db.collection("projetos").get();

    const projetos = [];

    snapshot.forEach(doc => {

      projetos.push({
        id: doc.id,
        ...doc.data()
      });

    });

    res.render("admin/projetos/index", {
      projetos
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao buscar projetos");

  }

});


// TELA CRIAR
router.get("/projetos/criar", (req, res) => {
  res.render("admin/projetos/criar");
});


// CRIAR PROJETO
router.post("/projetos/criar", async (req, res) => {

  try {

    const projeto = montarProjeto(req.body);

    // SE O SLUG NÃO FOR INFORMADO, GERA A PARTIR DO NOME
    const slug = slugify(req.body.slug) || slugify(req.body.nome);

    if (!slug) {
      return res.send("Informe um nome ou slug válido para o projeto");
    }

    projeto.slug = slug;

    // IMPEDE SOBRESCREVER UM PROJETO JÁ EXISTENTE COM O MESMO SLUG
    const existente = await db.collection("projetos").doc(slug).get();

    if (existente.exists) {
      return res.send("Já existe um projeto com esse slug. Escolha outro.");
    }

    // O ID DO DOCUMENTO PASSA A SER O PRÓPRIO SLUG
    await db.collection("projetos").doc(slug).set(projeto);

    res.redirect("/admin/projetos");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao criar projeto");

  }

});


// TELA EDITAR
router.get("/projetos/:id/editar", async (req, res) => {

  try {

    const doc =
      await db.collection("projetos")
        .doc(req.params.id)
        .get();

    if (!doc.exists) {
      return res.send("Projeto não encontrado");
    }

    const projeto = {
      id: doc.id,
      ...doc.data()
    };

    res.render("admin/projetos/editar", {
      projeto,
      helpers: {
        listaParaTexto,
        membrosParaTexto,
        fluxoParaTexto,
        componentesParaTexto,
        tecnologiasParaTexto
      }
    });

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao carregar projeto");

  }

});


// EDITAR PROJETO
router.post("/projetos/:id/editar", async (req, res) => {

  try {

    const projeto = montarProjeto(req.body);

    // O SLUG É O ID DO DOCUMENTO, NÃO PODE SER ALTERADO NA EDIÇÃO
    projeto.slug = req.params.id;

    await db.collection("projetos")
      .doc(req.params.id)
      .update(projeto);

    res.redirect("/admin/projetos");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao editar projeto");

  }

});


// DELETAR PROJETO
router.post("/projetos/:id/deletar", async (req, res) => {

  try {

    await db.collection("projetos")
      .doc(req.params.id)
      .delete();

    res.redirect("/admin/projetos");

  } catch (erro) {

    console.error(erro);

    res.send("Erro ao deletar projeto");

  }

});


module.exports = router;
