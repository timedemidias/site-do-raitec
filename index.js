const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();


// CONFIGURAÇÃO DO EJS
app.set("view engine", "ejs");


// MIDDLEWARES GLOBAIS

// Permite receber dados de formulários
app.use(express.urlencoded({
  extended: true
}));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Sessão do usuário
app.use(session({
  secret: "raitec-admin",
  resave: false,
  saveUninitialized: false
}));


// IMPORTAÇÃO DAS ROTAS

const sobreRoutes = require("./routes/quem-somos/sobre");
const estruturaRoutes = require("./routes/quem-somos/estrutura");
const membrosRoutes = require("./routes/quem-somos/membros/membros");
const projetosRoutes = require("./routes/projetos/projetos");
const eventosRoutes = require("./routes/eventos/eventos");
const extensaoRoutes = require("./routes/extensao/extensao");
const raipediaRoutes = require("./routes/raipedia/raipedia");
const processoSeletivoRoutes = require("./routes/processo-seletivo/processo-seletivo");
const noticiasRoutes = require("./routes/noticias/noticias");
const contatoRoutes = require("./routes/contato/contato");
const testeRoutes = require("./routes/teste");

const authRoutes = require("./routes/admin/auth");
const adminRoutes = require("./routes/admin/admin");
const adminMembrosRoutes = require("./routes/admin/membros");
const adminNoticiasRoutes = require("./routes/admin/noticias");

// USAR ROTAS
app.use("/", sobreRoutes);
app.use("/", estruturaRoutes);
app.use("/", membrosRoutes);
app.use("/", projetosRoutes);
app.use("/", eventosRoutes);
app.use("/", extensaoRoutes);
app.use("/", raipediaRoutes);
app.use("/", processoSeletivoRoutes);
app.use("/", noticiasRoutes);
app.use("/", contatoRoutes);
app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/", testeRoutes);
app.use("/admin", adminMembrosRoutes);
app.use("/admin", adminNoticiasRoutes);

// ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.render("index");
});


// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
