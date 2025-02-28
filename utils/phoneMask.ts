export default function formatPhone(numero: string): string {
    // Remove todos os caracteres que não são números
    const numeros = numero.replace(/\D/g, '');

    // Verifica se é um número válido (com DDD)
    if (numeros.length === 10) {
        // Telefone fixo: (XX) XXXX-XXXX
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 11) {
        // Celular: (XX) 9XXXX-XXXX
        return numeros.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    } else {
        // Retorna o número sem formatação se não for válido
        return numero;
    }
}