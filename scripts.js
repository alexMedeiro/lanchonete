document.addEventListener('DOMContentLoaded', function() {
    const salesForm = document.getElementById('sales-form');
    const salesList = document.getElementById('sales');
    const investmentForm = document.getElementById('investment-form');
    const investmentList = document.getElementById('investment-list');
    const chartsDiv = document.getElementById('charts');
    const drinkTypeSelect = document.getElementById('drink-type');
    const whiskyOptions = document.getElementById('whisky-options');
    const caipirinhaOptions = document.getElementById('caipirinha-options');
    const clearSalesButton = document.getElementById('clear-sales');
    const filterDashboardButton = document.getElementById('filter-dashboard');

    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    // Variável para armazenar o gráfico
    let salesChart;

    // Função para formatar a data
    function formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    // Função para atualizar a lista de vendas
    function updateSalesList() {
        salesList.innerHTML = '';
        sales.forEach((sale, index) => {
            const li = document.createElement('li');
            li.textContent = `Venda ${index + 1} (${formatDate(sale.date)}): ${sale.drinkType} - R$ ${sale.price.toFixed(2)}`;
            salesList.appendChild(li);
        });
    }

    // Função para atualizar a lista de investimentos
    function updateInvestmentList() {
        investmentList.innerHTML = '';
        investments.forEach((investment, index) => {
            const li = document.createElement('li');
            li.textContent = `Investimento ${index + 1}: ${investment.description} - R$ ${investment.amount.toFixed(2)}`;
            investmentList.appendChild(li);
        });
    }

    // Função para atualizar os gráficos
    function updateCharts(filter = {}) {
        // Filtra as vendas com base no filtro
        const filteredSales = sales.filter(sale => {
            if (filter.drinkType && sale.drinkType !== filter.drinkType) return false;
            if (filter.startDate && new Date(sale.date) < new Date(filter.startDate)) return false;
            if (filter.endDate && new Date(sale.date) > new Date(filter.endDate)) return false;
            return true;
        });

        // Total de vendas
        const totalSales = filteredSales.reduce((acc, sale) => acc + sale.price, 0);

        // Dados para o gráfico de pizza
        const salesByDrinkType = filteredSales.reduce((acc, sale) => {
            acc[sale.drinkType] = (acc[sale.drinkType] || 0) + sale.price;
            return acc;
        }, {});

        const labels = Object.keys(salesByDrinkType);
        const data = Object.values(salesByDrinkType);

        // Destrói o gráfico anterior, se existir
        if (salesChart) {
            salesChart.destroy();
        }

        // Cria o gráfico de pizza
        const ctx = document.createElement('canvas');
        chartsDiv.innerHTML = ''; // Limpa o conteúdo anterior
        chartsDiv.appendChild(ctx); // Adiciona o canvas ao dashboard

        salesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Total de Vendas: R$ ${totalSales.toFixed(2)}`
                    }
                }
            }
        });
    }

    // Evento para adicionar uma venda
    salesForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const drinkType = drinkTypeSelect.value;
        const price = parseFloat(document.getElementById('price').value);
        const date = new Date().toISOString(); // Adiciona a data atual

        const sale = {
            drinkType,
            price,
            date
        };

        if (drinkType === 'whisky') {
            sale.whiskyType = document.getElementById('whisky-type').value;
            sale.iceFlavor = document.getElementById('ice-flavor').value;
            sale.energyDrink = document.getElementById('energy-drink').value;
        } else if (drinkType === 'caipirinha') {
            sale.caipirinhaType = document.getElementById('caipirinha-type').value;
            sale.fruit = document.getElementById('fruit').value;
        }

        sale.cupSize = document.getElementById('cup-size').value;

        sales.push(sale);
        localStorage.setItem('sales', JSON.stringify(sales));

        updateSalesList();
        updateCharts();
        salesForm.reset();
    });

    // Evento para adicionar um investimento
    investmentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const description = document.getElementById('investment-description').value;
        const amount = parseFloat(document.getElementById('investment-amount').value);

        const investment = {
            description,
            amount
        };

        investments.push(investment);
        localStorage.setItem('investments', JSON.stringify(investments));

        updateInvestmentList();
        updateCharts();
        investmentForm.reset();
    });

    // Evento para limpar a lista de vendas
    clearSalesButton.addEventListener('click', function() {
        sales = [];
        localStorage.removeItem('sales');
        updateSalesList();
        updateCharts();
    });

    // Evento para aplicar filtros no dashboard
    filterDashboardButton.addEventListener('click', function() {
        const drinkTypeFilter = document.getElementById('filter-drink-type').value;
        const startDateFilter = document.getElementById('filter-start-date').value;
        const endDateFilter = document.getElementById('filter-end-date').value;

        updateCharts({
            drinkType: drinkTypeFilter || undefined,
            startDate: startDateFilter || undefined,
            endDate: endDateFilter || undefined
        });
    });

    // Evento para mostrar/esconder opções específicas de cada bebida
    drinkTypeSelect.addEventListener('change', function() {
        if (this.value === 'whisky') {
            whiskyOptions.style.display = 'block';
            caipirinhaOptions.style.display = 'none';
        } else if (this.value === 'caipirinha') {
            caipirinhaOptions.style.display = 'block';
            whiskyOptions.style.display = 'none';
        } else {
            whiskyOptions.style.display = 'none';
            caipirinhaOptions.style.display = 'none';
        }
    });

    // Inicialização
    updateSalesList();
    updateInvestmentList();
    updateCharts();
});