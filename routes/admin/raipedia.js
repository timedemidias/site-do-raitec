const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin");

// LISTAR CAPACITAÇÕES DE MICROCONTROLADORES
router.get("/admin/raipedia/capacitacoes/microcontroladores", async (req, res) => {
  try {
    const snapshot = await db.collection("raipedia")
      .where("categoria", "==", "microcontroladores")
      .get();

    const capacitacoes = [];
    snapshot.forEach(doc => {
      capacitacoes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.render("admin/raipedia/capacitacoes/microcontroladores/index", { capacitacoes });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar capacitações");
  }
});

// TELA DE EDIÇÃO
router.get("/admin/raipedia/microcontroladores/:slug/editar", async (req, res) => {
  try {
    const snapshot = await db.collection("raipedia")
      .where("slug", "==", req.params.slug)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Capacitação não encontrada");
    }

    const raipedia = {
      slug: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    res.render("admin/raipedia/capacitacoes/microcontroladores/editar", { raipedia });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao carregar capacitação");
  }
});

// SALVAR EDIÇÃO
router.post("/admin/raipedia/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    await db.collection("raipedia").doc(slug).update({

      "descricao-inicial": req.body["descricao-inicial"],

      "o-que-e": {
        "historia":                   req.body["historia"],
        "variantes-de-hardware":      req.body["variantes-de-hardware"],
        "comparacoes-com-outros-mcus": req.body["comparacoes-com-outros-mcus"]
      },

      "ambiente-de-desenvolvimento": {
        "arduino-ide":            req.body["arduino-ide"],
        "plataformIO-vscode":     req.body["plataformIO-vscode"],
        "simuladores":            req.body["simuladores"],
        "outras-possibilidades":  req.body["outras-possibilidades"]
      },

      "fundamentos-de-programacao": {
        "estrutura-do-codigo":  req.body["estrutura-do-codigo"],
        "descricao-dos-pinos":  req.body["descricao-dos-pinos"],
        "io-digital":           req.body["io-digital"],
        "comunicacao-serial":   req.body["comunicacao-serial"],
        "io-analogico":         req.body["io-analogico"]
      },

      "controle-e-protocolos": {
        "pwm":                  req.body["pwm"],
        "interrupcoes":         req.body["interrupcoes"],
        "protocolo-i2c":        req.body["protocolo-i2c"],
        "protocolo-spi":        req.body["protocolo-spi"],
        "timers-de-hardware":   req.body["timers-de-hardware"]
      },

      "topicos-avancados": {
        "gerenciamento-memoria":      req.body["gerenciamento-memoria"],
        "modos-de-baixo-consumo":     req.body["modos-de-baixo-consumo"],
        "multitarefa-com-freeRTOS":   req.body["multitarefa-com-freeRTOS"],
        "bootloader-e-fuses":         req.body["bootloader-e-fuses"]
      },

      "projetos-praticos": {
        "semaforo-com-botao": {
          "introducao": req.body["semaforo-com-botao-introducao"]
        }
      }

    });

    res.redirect("/admin/raipedia/capacitacoes/microcontroladores");
        
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao salvar capacitação");
  }
});

// TELA DE CRIAÇÃO
router.get("/admin/raipedia/capacitacoes/microcontroladores/criar", (req, res) => {
  res.render("admin/raipedia/capacitacoes/microcontroladores/criar");
});

// CRIAR CAPACITAÇÃO
router.post("/admin/raipedia/capacitacoes/microcontroladores/criar", async (req, res) => {
  try {

    const slug = req.body["slug"];

    await db.collection("raipedia").doc(slug).set({

      slug,
      categoria: "microcontroladores",
      nome: req.body["nome-micro"],
      "nome-micro":        req.body["nome-micro"],
      "descricao-inicial": req.body["descricao-inicial"],

      "o-que-e": {
        "historia":                    req.body["historia"],
        "variantes-de-hardware":       req.body["variantes-de-hardware"],
        "comparacoes-com-outros-mcus": req.body["comparacoes-com-outros-mcus"]
      },

      "ambiente-de-desenvolvimento": {
        "arduino-ide":           req.body["arduino-ide"],
        "plataformIO-vscode":    req.body["plataformIO-vscode"],
        "simuladores":           req.body["simuladores"],
        "outras-possibilidades": req.body["outras-possibilidades"]
      },

      "fundamentos-de-programacao": {
        "estrutura-do-codigo": req.body["estrutura-do-codigo"],
        "descricao-dos-pinos": req.body["descricao-dos-pinos"],
        "io-digital":          req.body["io-digital"],
        "comunicacao-serial":  req.body["comunicacao-serial"],
        "io-analogico":        req.body["io-analogico"]
      },

      "controle-e-protocolos": {
        "pwm":                req.body["pwm"],
        "interrupcoes":       req.body["interrupcoes"],
        "protocolo-i2c":      req.body["protocolo-i2c"],
        "protocolo-spi":      req.body["protocolo-spi"],
        "timers-de-hardware": req.body["timers-de-hardware"]
      },

      "topicos-avancados": {
        "gerenciamento-memoria":    req.body["gerenciamento-memoria"],
        "modos-de-baixo-consumo":   req.body["modos-de-baixo-consumo"],
        "multitarefa-com-freeRTOS": req.body["multitarefa-com-freeRTOS"],
        "bootloader-e-fuses":       req.body["bootloader-e-fuses"]
      },

      "projetos-praticos": {
        "semaforo-com-botao": {
          "introducao": req.body["semaforo-com-botao-introducao"]
        }
      }

    });

    res.redirect("/admin/raipedia/capacitacoes/microcontroladores");

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao criar capacitação");
  }
});

module.exports = router;