document.addEventListener('DOMContentLoaded', () => {
    
    // "BANCO DE DADOS" DO PERFIL DO MEMBRO

    // Aqui ficam todas as informações da página. 
    // nesse momento tem um modelo de "banco de dados" para a pagina "membro"(que é esse) 
    // e para a pagina "membros"(que tem vários pessoas). como essa é só a parte basica de front-end deixei assim,
    // mas na versão final seria realmente bom ter um arquivo só para o "banco de dados" dos membros
    const dadosDoMembro = {
        nome: "Marcos Bertolini",      // aqui é o nome da pessoa
        eixo: "Apoio",                 // o eixo dela, se não tiverer deixar sem nada msm
        time: "Processos",             // o time dela, se não tiverer deixar sem nada msm
        cargo: "Membro Efetivo",       // opções: membro efetivo, coordenador(ai tu coloca do que aqui), gerente(...), diretor
        foto: "#",// só colocar o caminho da foto
        projetos: [
            { 
                nome: "Reconhecimento de Libras (KNN/SVM)", 
                imagem: "" // só colocar o caminho da imagem do projeto
            },
            { 
                nome: "Circuito Microcontrolado", 
                imagem: "" 
            },
            { 
                nome: "Site Institucional", 
                imagem: "" 
            },
            { 
                nome: "Automação Arduino", 
                imagem: "" 
            }
        ]
    };






    // 
    // RENDERIZAÇÃO AUTOMÁTICA DOS DADOS NA TELA
    // 
    function renderizarPerfil(membro) {
        document.getElementById('breadcrumbNome').textContent = membro.nome.toLowerCase();
        document.getElementById('perfilNome').textContent = membro.nome;
        document.getElementById('perfilEixo').textContent = `EIXO: ${membro.eixo}`;
        document.getElementById('perfilTime').textContent = `TIME: ${membro.time}`;
        document.getElementById('perfilCargo').textContent = `CARGO: ${membro.cargo}`;
        
        // 2. Foto do Perfil
        const fotoElement = document.getElementById('perfilFoto');
        if (membro.foto) {
            fotoElement.src = membro.foto;
            fotoElement.style.display = 'block';
        } else {
            fotoElement.style.display = 'none';
        }



        // 3. Projetos Trabalhados (Injeção dos cards no carrossel)
        const track = document.getElementById('projetosTrack');
        track.innerHTML = ''; 
        
        membro.projetos.forEach(projeto => {
            const card = document.createElement('a');
            card.className = 'projeto-card';

            // coloca o link da pagina do projeto ou coloca '#' se n tiver nada     
            card.href = projeto.url || '#'; 
            
            const imagemHTML = projeto.imagem 
                ? `<img src="${projeto.imagem}" alt="${projeto.nome}" class="projeto-imagem">`
                : `<div class="projeto-imagem"></div>`; 
                
            card.innerHTML = `
                ${imagemHTML}
                <div class="projeto-nome">${projeto.nome}</div>
            `;
            
            track.appendChild(card);
        });
    }





    // Executa a montagem do layout baseado nos dados logo que a página carrega
    renderizarPerfil(dadosDoMembro);


    // 
    // LÓGICA DO MENU MOBILE (Importada)
    // 
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







    //
    // LÓGICA DO CARROSSEL DE PROJETOS
    //
    const track = document.getElementById('projetosTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    if (track && btnPrev && btnNext) {
        let isScrolling = false;

        function animarScroll(elemento, destino, duracao) {
            if (isScrolling) return;
            isScrolling = true;

            const inicio = elemento.scrollLeft;
            const distancia = destino - inicio;
            let tempoInicio = null;

            function animacao(tempoAtual) {
                if (tempoInicio === null) tempoInicio = tempoAtual;
                const tempoDecorrido = tempoAtual - tempoInicio;
                
                let progresso = Math.min(tempoDecorrido / duracao, 1);
                const suavizacao = progresso < 0.5 
                    ? 2 * progresso * progresso 
                    : 1 - Math.pow(-2 * progresso + 2, 2) / 2;

                elemento.scrollLeft = inicio + (distancia * suavizacao);

                if (tempoDecorrido < duracao) {
                    requestAnimationFrame(animacao);
                } else {
                    isScrolling = false; 
                }
            }
            requestAnimationFrame(animacao);
        }

        btnNext.addEventListener('click', () => {
            const card = track.querySelector('.projeto-card');
            if (!card) return;
            
            const tamanhoPasso = card.offsetWidth + 30; // 30px é o gap
            
            
            const destinoFinal = Math.ceil((track.scrollLeft + 1) / tamanhoPasso) * tamanhoPasso;
            
            animarScroll(track, destinoFinal, 600); 
        });
        
        btnPrev.addEventListener('click', () => {
            const card = track.querySelector('.projeto-card');
            if (!card) return;
            
            const tamanhoPasso = card.offsetWidth + 30;
            
            
            let destinoFinal = Math.floor((track.scrollLeft - 1) / tamanhoPasso) * tamanhoPasso;
            
            if (destinoFinal < 0) destinoFinal = 0;
            animarScroll(track, destinoFinal, 600);
        });
    }
});