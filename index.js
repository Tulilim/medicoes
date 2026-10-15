const express = require('express');
const db = require('./db');
const port = 3000;
const app = express();
app.use(express.json());

function calcularTEMP(valor_original){
    const tempCelsius = parseFloat(valor_original);
    const tempCalculada = (tempCelsius * 9 / 5) + 32
    const valor_convertido = parseFloat(tempCalculada.toFixed(2));

    let classificacao = ""
    if(valor_convertido < 50){
        classificacao = "O clima esta frio"
    }else if(valor_convertido >= 50 && valor_convertido <= 70){
        classificacao = "O clima esta agradavel"
    }else{
        classificacao = "O clima esta quente"
    }
    return {valor_convertido,classificacao};
}

function calcularVelo(valor_original){
    const velocidadeBase = parseFloat(valor_original);
    const velocidadeConvertida = velocidadeBase / 3.6
    const valor_convertido = parseFloat(velocidadeConvertida.toFixed(2));

    let classificacao = ""
    
    if(valor_convertido < 11.1){
        classificacao = "Baixa Velocidade"
    }else if (valor_convertido >= 11.1 && valor_convertido <= 25){
        classificacao = "Velocidade Moderada"
    }else{
        classificacao = "Alta Velocidade"
    }
    return {valor_convertido,classificacao};
}

function calcularCom(valor_original){
    const comprimentoM = parseFloat(valor_original);
    const comprimentoConvertido = comprimentoM * 3.28084
    const valor_convertido = parseFloat(comprimentoConvertido.toFixed(2));

    let classificacao = ""
    
    if(comprimentoM < 5){
        classificacao = "Curto"
    }else if(comprimentoM >=5 && comprimentoM <= 50){
        classificacao = "Curto"
    }else{
        classificacao = "Longo"
    }
    return {valor_convertido, classificacao};


}


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/medicao', async(req,res) => {
    try {
        const[rows] = await db.execute('SELECT * FROM medicoes');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
})

app.get('/medicao/alta-velocidade', async(req,res) => {
    try {
        const[rows] = await db.execute('select * from medicoes where classificacao = "Alta Velocidade"');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
})

app.get('/medicao/:id', async(req,res) => {
    const {id} = req.params;
    try {
        const[rows] = await db.execute('select * from medicoes where id=?',[id]);
        if(rows.leght ===0){
            return res.status(404).json({
                mensagem:"Paciente nao encontrado",
                detalhes:"error.message"            
            });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
});

app.post('/medicao', async(req,res) => {
    const {descricao, tipo, valor_original, unidade_original, valor_convertido, unidade_convertida,  classificacao} = req.body
    if(!unidade_convertida||!unidade_original||!descricao||!valor_convertido || !valor_original || !tipo || !classificacao){
        return res.status(404).json({
            mensagem:"Verifique se todos os dados foram preenchidos!",
            detalhes:error.message 
        });
    }
    if(tipo == "temperatura" || tipo == "Temperatura"){
        const{valor_convertido,classificacao} = calcularTEMP(Number(valor_original));
    }else if(tipo === "velocidade" || tipo === "Velocidade"){
        const{valor_convertido,classificacao} = calcularVelo(Number(valor_original))
    }else if(tipo == "comprimento" || tipo=="Comprimento"){
        const{valor_convertido,classificacao} = calcularCom(Number(valor_original))
    }else{
        return res.status(404).json({
            mensagem:"Tipo invalido",
            detalhes:error.message 
        })
    }
    try {
        const[rows] = await db.execute('INSERT INTO `medicoes` (`descricao`, `tipo`, `valor_original`, `unidade_original`, `valor_convertido`, `unidade_convertida`,`classificacao`) VALUES (?,?,?,?,?,?,?);', [descricao,tipo,valor_original,unidade_original,valor_convertido,unidade_convertida,classificacao]);
        res.status(201).json({
        id:rows.insertId,
        descricao,
        tipo,
        valor_original,
        unidade_original,
        valor_convertido,
        unidade_convertida,
        classificacao
    });
    } catch (error) {
        res.status(500).json({
            mensagem:"Erro interno do servidor",
            detalhes:error.message
        });  
    }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});