// DADOS MOCK
const projetos_ativos = [
  {
    nome: "Maquina de Filamento",
    slug: "maquina-de-filamento",  
    eixo_time: "Técnico",         
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Raitor",
    slug: "raitor",           
    eixo_time: "Técnico", 
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "RAITecHydro",
    slug: "raitechydro",   
    eixo_time: "Técnico",         
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Maquete IOT",
    slug: "maquete-iot",  
    eixo_time: "Técnico",          
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "GameBOY",
    slug: "gameboy",  
    eixo_time: "Inovação",          
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Bracinho",
    slug: "bracinho",  
    eixo_time: "Inovação",          
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Bracelete Sensorial",
    slug: "bracelete-sensorial",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Aplicativo de Libras",
    slug: "aplicativo-de-libras",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  }
];

const projetos_arquivados = [
  {
    nome: "Wallerson",
    slug: "wallerson",    
    eixo_time: "Técnico",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Drone",
    slug: "drone",     
    eixo_time: "Técnico",       
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Dinossalto",
    slug: "dinossalto",     
    eixo_time: "Inovação",       
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Baby Yoda",
    slug: "baby-yoda",     
    eixo_time: "Inovação",       
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Comedouro Automático",
    slug: "comedouro-automatico",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Modelo Preditivo",
    slug: "modelo-preditivo",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  }
];

const projetos_finalizados = [
  {
    nome: "Gangorra",
    slug: "gangorra", 
    eixo_time: "Técnico",           
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Tri Tanque",
    slug: "tri-tanque",    
    eixo_time: "Técnico",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "RAInel",
    slug: "rainel",    
    eixo_time: "Inovação",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Braço Robótico",
    slug: "braco-robotico",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  },
  {
    nome: "Análise de Dados",
    slug: "analise-de-dados",    
    eixo_time: "Apoio",        
    descricao_curta: "blablabla...", 
    descricao_longa: "blablabla...", 
    membros: [],         
    imagem: "url de imagem",         
    link_doc: "link do doc",
    link_github: "link do repositório",    
  }
];


// LISTA DE PROJETOS
router.get("/projetos", (req, res) => {
  res.render("projetos/index", { 
    projetos_ativos,
    projetos_arquivados,
    projetos_finalizados 
  });
});


// PROJETO INDIVIDUAL
router.get("/projetos/:slug", (req, res) => {
  const slug = req.params.slug;

  const projeto = 
    projetos_ativos.find(p => p.slug === slug) ||
    projetos_arquivados.find(p => p.slug === slug) ||
    projetos_finalizados.find(p => p.slug === slug);

  if (!projeto) {
    return res.status(404).send("Projeto não encontrado");
  }

  res.render("projetos/projeto", { projeto });
});*/


/*v2: direto do banco
router.get("/projetos", async (req, res) => {
  try {
    const snapshot = await db.collection("projetos").get();

    const ativos = [];
    const arquivados = [];
    const finalizados = [];

    snapshot.forEach(doc => {
      const projeto = {
        id: doc.id,
        ...doc.data()
      };

      if (projeto.status === "ativo") {
        ativos.push(projeto);
      } else if (projeto.status === "arquivado") {
        arquivados.push(projeto);
      } else if (projeto.status === "finalizado") {
        finalizados.push(projeto);
      }
    });

    res.render("projetos/index", { ativos, arquivados, finalizados });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar projetos");
  }
});

