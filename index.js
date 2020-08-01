import { promises as fs } from 'fs';

//cria um Array que recebera Sigla como Estado e Array com nome das Cidades
let estadosCidades = []; 
let estadosQtdeCidades = [];
let cidadeUF = [];

init();

async function init() {
  await readFilesAndWriteFiles();
  console.log('\n5 Estados com mais cidades:');
  await imprimeEstadosMaisCidades();
  console.log('\n5 Estados com menos cidades:');
  await imprimeEstadosMenosCidades();
  console.log('\nCidade de maior nome em cada estado:');
  maiorNomeCadaEstado();
  console.log('\nCidade de menor nome em cada estado:');
  menorNomeCadaEstado();
  console.log('\nCidade de maior nome em todos os estados:');
  maiorNomeTodosEstados();
  console.log('\nCidade de menor nome em todos os estados:');
  menorNomeTodosEstados();  
}

async function readFilesAndWriteFiles() {
  try { 
    //faz a leitura do arquivo Estados.json
    const estados = JSON.parse(await fs.readFile("Estados.json"));
    // console.log(estados);

    //faz a leitura do arquivo Cidades.json
    const cidades = JSON.parse(await fs.readFile("Cidades.json"));
    // console.log(cidades);

    estados.forEach((estado) => {
      const listaCidades = cidades
        .filter((cidade) => cidade.Estado === estado.ID);
      estadosCidades.push({ 
        Estado: estado.Sigla, 
        Cidades: listaCidades.map(({ Nome }) => Nome ) });
    });
    // console.log(estadosCidades);

    //grava arquivo para cada um dos estados com Array com o nome das cidades
    estadosCidades.forEach(async (estado) => {
      await fs.writeFile(`./arquivos/${estado.Estado}.json`, 
        JSON.stringify(estado.Cidades));
    })
  } catch (err) {
    console.log(err);
  }
}

async function countCities(UF) {
  try {
    const cidadesUF = JSON.parse(await fs.readFile(`./arquivos/${UF}.json`));
    return cidadesUF.length;
  } catch (err) {
    console.log(err);
  }
};

async function imprimeEstadosMaisCidades() {

  for (const estado of estadosCidades) {
    await countCities(estado.Estado).then((qtdeCidades) => {
      estadosQtdeCidades.push({ estado: estado.Estado, qtdeCidades});
    });
  };

  estadosQtdeCidades.sort((a, b) => {
    return b.qtdeCidades - a.qtdeCidades
  });

  const cincoMaisCidades = estadosQtdeCidades.slice(0, 5);

  cincoMaisCidades.forEach(estado => {
    console.log(`${estado.estado} - ${estado.qtdeCidades}`);
  })
};

async function imprimeEstadosMenosCidades() {

  estadosQtdeCidades.sort((a, b) => {
    return a.qtdeCidades - b.qtdeCidades
  });

  const cincoMenosCidades = estadosQtdeCidades.slice(0, 5);
  cincoMenosCidades.sort((a, b) => {
    return b.qtdeCidades - a.qtdeCidades
  })

  cincoMenosCidades.forEach(estado => {
    console.log(`${estado.estado} - ${estado.qtdeCidades}`);
  })
};

function maiorNomeCadaEstado() {
  const maiorNomeCadaEstado = [];

  for (const estado of estadosCidades) {
    
    const cidades = estado.Cidades;
    let maiorNomeEstado = cidades[0];

    cidades.forEach((cidade) => {
      if (cidade.length > maiorNomeEstado.length) {
        maiorNomeEstado = cidade; 
      }
    });

    maiorNomeCadaEstado.push({ estado: estado.Estado, maiorNome: maiorNomeEstado});
  };

  maiorNomeCadaEstado.forEach(estado => {
    console.log(`${estado.maiorNome} - ${estado.estado}`);
  })
};

function menorNomeCadaEstado() {
  const menorNomeCadaEstado = [];

  for (const estado of estadosCidades) {
    
    const cidades = estado.Cidades;
    let menorNomeEstado = cidades[0];

    cidades.forEach((cidade) => {
      if (cidade.length < menorNomeEstado.length) {
        menorNomeEstado = cidade; 
      }
    });

    menorNomeCadaEstado.push({ estado: estado.Estado, menorNome: menorNomeEstado});
  };

  menorNomeCadaEstado.forEach(estado => {
    console.log(`${estado.menorNome} - ${estado.estado}`);
  })
}

function maiorNomeTodosEstados() {
  for (const estado of estadosCidades) {
    const cidades = estado.Cidades;
    cidades.forEach(cidade => {
      cidadeUF.push({ cidade, UF: estado.Estado });
    });
  };
  //colocar em ordem alfabetica todas as cidades
  cidadeUF.sort((a, b) => {
    return ('' + a.cidade).localeCompare(b.cidade);
  });

  let maiorNome = cidadeUF[0].cidade;
  let ufMaiorNome = cidadeUF[0].UF;

  cidadeUF.forEach(cidade => {
    if (cidade.cidade.length > maiorNome.length) {
      maiorNome = cidade.cidade; 
      ufMaiorNome = cidade.UF;
    }
  });

  console.log(`${maiorNome} - ${ufMaiorNome}`);
}

function menorNomeTodosEstados() {
  let menorNome = cidadeUF[0].cidade;
  let ufMenorNome = cidadeUF[0].UF;

  cidadeUF.forEach(cidade => {
    if (cidade.cidade.length < menorNome.length) {
      menorNome = cidade.cidade; 
      ufMenorNome = cidade.UF;
    }
  });

  console.log(`${menorNome} - ${ufMenorNome}`);
}
