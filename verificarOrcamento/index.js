module.exports = async function (context, req) {
    try {
        const { valorTotal, orcamentoMensal, orcamentoRestante, numMembros } = req.body;
        
        // Validação dos parâmetros
        if (typeof valorTotal !== 'number' || typeof orcamentoMensal !== 'number' || 
            typeof orcamentoRestante !== 'number' || typeof numMembros !== 'number') {
            throw new Error("Parâmetros inválidos");
        }

        const valorIndividual = valorTotal / numMembros;
        const novoSaldo = orcamentoRestante - valorIndividual;
        const percentual = ((orcamentoMensal - novoSaldo) / orcamentoMensal) * 100;

        // Gerar alerta
        let alerta = null;
        if (percentual >= 100) {
            alerta = {
                tipo: "urgente",
                mensagem: "❌ Orçamento ESGOTADO (100% ou mais)",
                data: new Date().toISOString()
            };
        } else if (percentual >= 80) {
            alerta = {
                tipo: "aviso",
                mensagem: "⚠️ ATENÇÃO: Você gastou 80% ou mais do orçamento",
                data: new Date().toISOString()
            };
        }

        context.res = {
            status: 200,
            body: {
                alerta,
                valorIndividual,
                novoSaldo,
                percentualUsado: percentual
            }
        };
    } catch (error) {
        console.error("Erro no HTTP Trigger:", error);
        context.res = {
            status: 400,
            body: { error: error.message }
        };
    }
};