function calcularTEMP(valor_original, unidade_original){
    const tempCelsius = parseFloat(valor_original);
    let tempCalculada = 0
    let classificacao = ""
    let unidade_convertida = ""
    if(unidade_original === "c"){
        tempCalculada = (tempCelsius * 9 / 5) + 32
        unidade_convertida = "f";

        if(tempCalculada < 50){
            classificacao = "O clima esta frio"
        }else if(tempCalculada >= 50 && tempCalculada <= 70){
            classificacao = "O clima esta agradavel"
        }else{
            classificacao = "O clima esta quente"
        }
    }else{
        tempCalculada = (tempCelsius - 32) * 5 / 9
        unidade_convertida = "c";

        if(tempCalculada < 10){
            classificacao = "O clima esta frio"
        }else if(tempCalculada >= 10 && tempCalculada <= 21){
            classificacao = "O clima esta agradavel"
        }else{
            classificacao = "O clima esta quente"
        }
    }
    const valor_convertido = parseFloat(tempCalculada.toFixed(2));
    return {valor_convertido,classificacao, unidade_convertida};
}

function calcularVelo(valor_original, unidade_original){
    const velocidadeBase = parseFloat(valor_original);
    let velocidadeConvertida = 0;
    let classificacao = ""
    let unidade_convertida = ""
    
    if(unidade_original === "km/h"){
        velocidadeConvertida = velocidadeBase / 3.6
        unidade_convertida = "m/s";

        if(velocidadeConvertida < 11.1){
            classificacao = "Baixa Velocidade"
        }else if (velocidadeConvertida >= 11.1 && velocidadeConvertida <= 25){
            classificacao = "Velocidade Moderada"
        }else{
            classificacao = "Alta Velocidade"
        }
    }else{
        velocidadeConvertida = velocidadeBase * 3.6
        unidade_convertida = "km/h";
        if(velocidadeConvertida < 5){
            classificacao = "Baixa Velocidade"
        }else if (velocidadeConvertida >= 5 && velocidadeConvertida <= 90){
            classificacao = "Velocidade Moderada"
        }else{
            classificacao = "Alta Velocidade"
        }
    }
    const valor_convertido = parseFloat(velocidadeConvertida.toFixed(2));
    return {valor_convertido,classificacao, unidade_convertida};
}

function calcularCom(valor_original, unidade_original){
    const comprimentoM = parseFloat(valor_original);
    let comprimentoConvertido
    let classificacao = ""
    let unidade_convertida = ""
    if(unidade_original === "m"){
        comprimentoConvertido = comprimentoM * 3.28084
        unidade_convertida = "ft";
        if(comprimentoConvertido < 16.40){
            classificacao = "Curto"
        }else if(comprimentoConvertido >=16.40 && comprimentoConvertido <= 164){
            classificacao = "Médio"
        }else{
            classificacao = "Longo"
        }

    }else{
        comprimentoConvertido = comprimentoM * 0.3048
        unidade_convertida = "m";
        if(comprimentoConvertido < 5){
            classificacao = "Curto"
        }else if(comprimentoConvertido >=5 && comprimentoConvertido <= 50){
            classificacao = "Médio"
        }else{
            classificacao = "Longo"
        }
    }
    const valor_convertido = parseFloat(comprimentoConvertido.toFixed(2));
    return {valor_convertido, classificacao, unidade_convertida};


}

function resultadoConv(tipo,valor_original, unidade_original){
    tipo = tipo.toLowerCase()
    unidade_original = unidade_original.toLowerCase()
    
    if(tipo !== "temperatura" && tipo !== "velocidade" && tipo !== "comprimento"){
        return { erro: "Tipo inválido! Os tipos aceitos são: temperatura, velocidade ou comprimento." };
    }

    if(tipo == "temperatura"){
        if(unidade_original !== "c" && unidade_original !== "f"){
            return { erro: `Unidade '${unidade_original}' incompatível para temperatura. Use 'C' ou 'F'.` };
        }else{
            return calcularTEMP(Number(valor_original), unidade_original);
        }

    }else if(tipo === "velocidade"){
        if(unidade_original !== "km/h" && unidade_original !== "m/s"){
            return { erro: `Unidade '${unidade_original}' incompatível para velocidade. Use 'km/h' ou 'm/s'.` };
        }else{
            return calcularVelo(Number(valor_original), unidade_original);
        }
       
    }else if(tipo == "comprimento"){
        if(unidade_original !== "m" && unidade_original !== "ft"){
            return { erro: `Unidade '${unidade_original}' incompatível para comprimento. Use 'm' ou 'ft'.` };
        }else{
            return calcularCom(Number(valor_original), unidade_original)
        }
    }
}

module.exports = {resultadoConv};