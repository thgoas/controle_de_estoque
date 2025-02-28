export default function formatCEP(cep: string, adicionarMascara: boolean = true): string {
    // Remove todos os caracteres que não são números
    const numerosCEP = cep.replace(/\D/g, '');

    if (adicionarMascara) {
        // Adiciona a máscara ao CEP (formato: 00000-000)
        return numerosCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
    } else {
        // Retorna o CEP sem máscara
        return numerosCEP;
    }
}