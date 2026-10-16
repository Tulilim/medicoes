const express = require('express');
const db = require('./db');
const port = 3000;
const app = express();
app.use(express.json());
const{resultadoConv} = require('./conversoes')




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
        if(rows.length ===0){
            return res.status(404).json({
                mensagem:"Medicao nao encontrado",
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
    const {descricao, valor: valor_original, unidade_original, tipo} = req.body

    if(!descricao || descricao.trim() === "" || !valor_original || !unidade_original || !tipo){
        return res.status(400).json({
            mensagem: "Verifique se todos os dados foram preenchidos (incluindo a descrição)!"
        });
    }

    if(isNaN(Number(valor_original))){
        return res.status(400).json({
            mensagem: "O campo 'valor_original' precisa ser um número válido!"
        });
    }

    const result = resultadoConv(tipo, valor_original, unidade_original);
    if(result.erro){
        return res.status(400).json({
            mensagem:"Tipo ou unidade invalido", 
        })
    }
    const {valor_convertido, classificacao, unidade_convertida} = result;
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
            detalhes:error.message,
            return: null
        });  
    }
})

app.put('/medicao/:id', async (req,res) => {
    const { id } = req.params;
    const {descricao, valor: valor_original, unidade_original, tipo} = req.body

    if(!descricao || descricao.trim() === "" || !valor_original || !unidade_original || !tipo){
        return res.status(400).json({
            mensagem: "Verifique se todos os dados foram preenchidos (incluindo a descrição)!"
        });
    }

    if(isNaN(Number(valor_original))){
        return res.status(400).json({
            mensagem: "O campo 'valor_original' precisa ser um número válido!"
        });
    }

    const result = resultadoConv(tipo, valor_original, unidade_original);
    if(result.erro){
        return res.status(400).json({
            mensagem:"Tipo ou unidade invalido", 
        })
    }
    const {valor_convertido, classificacao, unidade_convertida} = result;

    try {
        const [rows] = await db.execute('UPDATE `medicoes` SET `descricao` = ?, `tipo` = ?, `valor_original` = ?, `unidade_original` = ?, `valor_convertido` = ?, `unidade_convertida` = ?, `classificacao` = ? WHERE `medicoes`.`id` = ?;', [descricao,tipo,valor_original,unidade_original,valor_convertido,unidade_convertida,classificacao,id]);
        if(rows.affectedRows === 0){
            return res.status(404).json({
                mensagem: "Medição não encontrada para atualização"
            });
        }

        res.status(200).json({
            id:rows.insertId,
            descricao,
            tipo,
            valor_original,
            unidade_original,
            valor_convertido,
            unidade_convertida,
            classificacao,
            mensagem: "Medição atualizada com sucesso"
        });
    }catch (error) {
        res.status(500).json({
        mensagem:"Erro interno do servidor",
        detalhes:error.message
        })
    }

})
app.delete('/medicao/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const[rows] = await db.execute('delete from medicoes where id=?',[id]);
    if(rows.affectedRows === 0){
      return res.status(404).json({
        mensagem:"medicao nao encontrada",
      })
    }
    res.status(200).json({
        mensagem: `Medicao de id ${id} deletada com sucesso`
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