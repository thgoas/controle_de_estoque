export default function formatCPF(cpf: string, adicionarMascara: boolean = true): string {
    // Remove todos os caracteres que não são números
    const numerosCPF = cpf.replace(/\D/g, '');

    if (adicionarMascara) {
        // Adiciona a máscara ao CPF (formato: 000.000.000-00)
        return numerosCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        // Retorna o CPF sem máscara
        return numerosCPF;
    }
}