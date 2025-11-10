const appContent = document.getElementById('app-content');

// --- Funções de Renderização de Views ---

const renderInicio = () => {
    appContent.innerHTML = `
        <div class="content-box">
            <h2>Bem-vindo!</h2>
            <p>Utilize o menu acima para navegar. Este sistema ajuda a otimizar o processo de descongelamento de produtos.</p>
            <h3>Fluxo de Trabalho:</h3>
            <ol>
                <li><b>Configurar SKUs:</b> Defina os parâmetros de cada produto (validade, capacidade).</li>
                <li><b>Importar Dados:</b> Envie o histórico de vendas em formato CSV.</li>
                <li><b>Calcular e Gerar Relatório:</b> O sistema irá calcular a retirada diária e gerar um relatório.</li>
                <li><b>Dashboard:</b> Acompanhe os principais indicadores de estoque.</li>
            </ol>
        </div>
    `;
};

const renderDashboard = async () => {
    appContent.innerHTML = `<div class="content-box"><h2>Dashboard</h2><p>Carregando dados...</p></div>`;
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        const retiradasHtml = data.retiradas.map(r => `
            <tr>
                <td>${r.data}</td>
                <td>${r.sku}</td>
                <td>${r.kg_retirados}</td>
            </tr>
        `).join('');

        const estoqueHtml = data.estoque.map(e => `
            <tr>
                <td>${e.sku}</td>
                <td>${e.total}</td>
            </tr>
        `).join('');

        appContent.innerHTML = `
            <div class="content-box">
                <h2>Dashboard Operacional</h2>
                <div style="display:flex; gap: 2em;">
                    <div style="flex:1;">
                        <h3>Últimas Retiradas Calculadas</h3>
                        <table>
                            <thead><tr><th>Data</th><th>SKU</th><th>Kg Retirados</th></tr></thead>
                            <tbody>${retiradasHtml || '<tr><td colspan="3">Nenhuma retirada encontrada.</td></tr>'}</tbody>
                        </table>
                    </div>
                    <div style="flex:1;">
                        <h3>Estoque Atual (Líquido)</h3>
                        <table>
                            <thead><tr><th>SKU</th><th>Kg Disponível</th></tr></thead>
                            <tbody>${estoqueHtml || '<tr><td colspan="2">Nenhum item em estoque.</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
                <br>
                <h3>Ações Rápidas</h3>
                <button id="calculate-btn">Calcular Retiradas de Hoje</button>
                <a href="/api/relatorio" download><button>Gerar Relatório Diário</button></a>
                <div id="status-message" class="status-message" style="display:none;"></div>
            </div>
        `;

        document.getElementById('calculate-btn').addEventListener('click', async () => {
            const statusDiv = document.getElementById('status-message');
            statusDiv.textContent = 'Calculando...';
            statusDiv.className = 'status-message';
            statusDiv.style.display = 'block';
            
            const calcResponse = await fetch('/api/calcular', { method: 'POST' });
            const result = await calcResponse.json();
            
            if (calcResponse.ok) {
                statusDiv.textContent = result.message;
                statusDiv.classList.add('success');
            } else {
                statusDiv.textContent = `Erro: ${result.error}`;
                statusDiv.classList.add('error');
            }
        });

    } catch (error) {
        appContent.innerHTML = `<div class="content-box error">Erro ao carregar o dashboard: ${error}</div>`;
    }
};

const renderSkus = async () => {
    appContent.innerHTML = `<div class="content-box"><h2>Configurar SKUs</h2><p>Carregando...</p></div>`;
    try {
        const response = await fetch('/api/skus');
        const skus = await response.json();

        const skusHtml = skus.map(s => `
            <tr>
                <td>${s.sku}</td>
                <td>${s.validade_dias}</td>
                <td>${s.capacidade_maxima}</td>
            </tr>
        `).join('');

        appContent.innerHTML = `
            <div class="content-box">
                <div style="display:flex; gap: 2em;">
                    <div style="flex:1;">
                        <h3>Adicionar ou Atualizar SKU</h3>
                        <form id="sku-form">
                            <input type="text" name="sku" placeholder="Nome do SKU" required>
                            <input type="number" name="validade" placeholder="Validade (dias)" value="2" min="1" required>
                            <input type="number" name="capacidade" step="0.1" placeholder="Capacidade Máx. (kg)" required>
                            <input type="submit" value="Salvar">
                        </form>
                        <div id="status-message" class="status-message" style="display:none;"></div>
                    </div>
                    <div style="flex:2;">
                        <h3>SKUs Configurados</h3>
                        <table>
                            <thead><tr><th>SKU</th><th>Validade (dias)</th><th>Capacidade Máxima (kg)</th></tr></thead>
                            <tbody>${skusHtml || '<tr><td colspan="3">Nenhum SKU configurado.</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('sku-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const statusDiv = document.getElementById('status-message');
            
            const saveResponse = await fetch('/api/skus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await saveResponse.json();

            if (saveResponse.ok) {
                statusDiv.textContent = result.message;
                statusDiv.className = 'status-message success';
                statusDiv.style.display = 'block';
                setTimeout(renderSkus, 1500); // Recarrega a view
            } else {
                statusDiv.textContent = `Erro: ${result.error || result.message}`;
                statusDiv.className = 'status-message error';
                statusDiv.style.display = 'block';
            }
        });
    } catch (error) {
        appContent.innerHTML = `<div class="content-box error">Erro ao carregar SKUs: ${error}</div>`;
    }
};

const renderUpload = () => {
    appContent.innerHTML = `
        <div class="content-box">
            <h2>Importar Histórico de Vendas (CSV)</h2>
            <form id="upload-form">
                <input type="file" name="file" accept=".csv" required>
                <input type="submit" value="Importar">
            </form>
            <div id="status-message" class="status-message" style="display:none;"></div>
            <p><small>O CSV deve conter as colunas: 'data' (YYYY-MM-DD), 'sku', 'kg_vendidos'.</small></p>
        </div>
    `;

    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusDiv = document.getElementById('status-message');
        const formData = new FormData(e.target);
        
        statusDiv.textContent = 'Enviando arquivo...';
        statusDiv.className = 'status-message';
        statusDiv.style.display = 'block';

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok) {
                statusDiv.textContent = result.success;
                statusDiv.classList.add('success');
            } else {
                statusDiv.textContent = `Erro: ${result.error}`;
                statusDiv.classList.add('error');
            }
        } catch (error) {
            statusDiv.textContent = `Erro de comunicação: ${error}`;
            statusDiv.classList.add('error');
        }
    });
};

// --- Roteador Simples ---
const routes = {
    '/': renderInicio,
    '/dashboard': renderDashboard,
    '/skus': renderSkus,
    '/upload': renderUpload,
};

const router = () => {
    const path = window.location.hash.substring(1) || '/';
    const view = routes[path] || renderInicio; // Fallback para a página inicial

    // Atualiza o link ativo
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`nav a[href="#${path}"]`) || document.getElementById('nav-inicio');
    if (activeLink) activeLink.classList.add('active');

    view();
};

// --- Event Listeners ---
window.addEventListener('hashchange', router);
window.addEventListener('load', router); // Carrega a view correta ao carregar a página