// Banco de dados atualizado com Eixo, Time, Cargo, link de perfil e foto

// Aqui ficam todas as informações da página. 
// nesse momento tem um modelo de "banco de dados" para a pagina "membros"(esse) ...
// ...e para a pagina "membro". como essa é só a parte basica de front-end deixei assim, ...
// ...mas na versão final seria realmente bom ter um arquivo só para o "banco de dados" dos membros.
// uma dica pra isso é atribuir um "id" a cada pessoa. como está no "antigo"
const members = [
    { 
        nome: "Savlio",  // aqui é o nome da pessoa
        eixo: "Apoio",   // o eixo dela, se não tiverer deixar sem nada msm
        time: "",        // o time dela, se não tiverer deixar sem nada msm
        cargo: "Coordenador (Apoio) ", // opções: membro efetivo, coordenador(ai tu coloca do que aqui), gerente(...), diretor
        foto: "",        // só colocar o caminho da foto
        perfilUrl: "#"   // Link para onde o card deve redirecionar ao ser clicado
    },
    { 
        nome: "Marcos", 
        eixo: "Apoio", 
        time: "mídias", 
        cargo: "Membro Efetivo",
        foto: "#",
        perfilUrl: "#"
    },
    { 
        nome: "Igor Morse", 
        eixo: "Inovação", 
        time: "mídias", 
        cargo: "Membro Efetivo",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "Geovana", 
        eixo: "Inovação", 
        time: "", 
        cargo: "Coordenador (Inovação)",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "Lucas Sobral", 
        eixo: "Técnico", 
        time: "", 
        cargo: "Coordenador (Técnico)",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "rafael", 
        eixo: "Inovação", 
        time: "mídias", 
        cargo: "Membro Efetivo",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "davi Jessé", 
        eixo: "", 
        time: "mídias", 
        cargo: "Coordenador (Mídias)",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "xarope", 
        eixo: "Técnico", 
        time: "Processos", 
        cargo: "Membro Efetivo",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "Letícia", 
        eixo: "", 
        time: "Processos", 
        cargo: "Coordenador (Processos)",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "Amanda Mapurunga", 
        eixo: "Apoio", 
        time: "mídias", 
        cargo: "Membro Efetivo",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "Fernando", 
        eixo: "", 
        time: "", 
        cargo: "Diretor",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "joãzinho", 
        eixo: "", 
        time: "", 
        cargo: "Gerente (Institucional)",
        foto: "",
        perfilUrl: "#"
    },
    { 
        nome: "aquiles", 
        eixo: "Inovação", 
        time: "mídias", 
        cargo: "Consultor",
        foto: "src/fto-npc-raitec.png",
        perfilUrl: "#"
    },
];

const grid = document.getElementById('membersGrid');
const searchInput = document.getElementById('searchInput');

// Função para criar os cards
function renderMembers(data) {
    grid.innerHTML = ''; 

    data.forEach(member => {
        // link (tag 'a') em vez de uma 'div' para tornar o card clicável
        const card = document.createElement('a');
        card.href = member.perfilUrl; 
        card.className = 'member-card'; 

        const imageHTML = member.foto 
            ? `<img src="${member.foto}" alt="Foto de ${member.nome}" class="member-image">` 
            : `<div class="member-image"></div>`; 
        
        card.innerHTML = `
            ${imageHTML}
            <div class="member-name">${member.nome}</div>
            <div class="member-info"><strong>Eixo:</strong> ${member.eixo}</div>
            <div class="member-info"><strong>Time:</strong> ${member.time}</div>
            <div class="member-info"><strong>Cargo:</strong> ${member.cargo}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Renderiza inicialmente
renderMembers(members);

// Motor de busca (Filtra por nome, eixo, time ou cargo)
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    
    
    const filteredMembers = members.filter(member => 
        member.nome.toLowerCase().includes(searchTerm) || 
        member.eixo.toLowerCase().includes(searchTerm) ||
        member.time.toLowerCase().includes(searchTerm) ||
        member.cargo.toLowerCase().includes(searchTerm)
    );
    
    renderMembers(filteredMembers);
});


// LÓGICA DO MENU MOBILE 

const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');
const menuMobile = document.getElementById('menuMobile');

if (btnAbrir && btnFechar && menuMobile) {
    btnAbrir.addEventListener('click', () => {
        menuMobile.classList.add('ativo');
    });

    btnFechar.addEventListener('click', () => {
        menuMobile.classList.remove('ativo');
    });
}