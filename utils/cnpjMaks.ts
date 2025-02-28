export default function formatCNPJ(cnpj: string, adicionarMascara: boolean = true): string {
    // Remove todos os caracteres que não são números
    const numerosCNPJ = cnpj.replace(/\D/g, '');

    if (adicionarMascara) {
        // Adiciona a máscara ao CNPJ (formato: 00.000.000/0000-00)
        return numerosCNPJ.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    } else {
        // Retorna o CNPJ sem máscara
        return numerosCNPJ;
    }
}
