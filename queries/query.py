import os
import json
from pathlib import Path
from SPARQLWrapper import SPARQLWrapper, JSON

def clear():
  os.system('cls' if os.name == 'nt' else 'clear')

clear()

# 1. Configura o endpoint oficial do Wikidata
# É obrigatório definir um User-Agent amigável para evitar bloqueios
endpoint_url = "https://query.wikidata.org/sparql"
user_agent = "MeuScriptWikidata/1.0 (moacir21@gmail.com)"

sparql = SPARQLWrapper(endpoint_url, agent=user_agent)

# 2. Lê a query salva no arquivo .rq
caminho_consulta = Path(__file__).resolve().parent / "musicista.rq"
with caminho_consulta.open("r", encoding="utf-8") as arquivo:
    query_sparql = arquivo.read()

sparql.setQuery(query_sparql)
sparql.setReturnFormat(JSON)

try:
    # 3. Executa a query localmente e recebe os dados
    resultados = sparql.query().convert()
    url_prefix = "http://www.wikidata.org/entity/"
    pessoas = {}

    for resultado in resultados["results"]["bindings"]:
        item = resultado["item"]["value"].removeprefix(url_prefix)
        item_label = resultado["itemLabel"]["value"]
        area_da_musica = resultado["areaDaMusica"]["value"].removeprefix(url_prefix)
        area_da_musica_label = resultado["areaDaMusicaLabel"]["value"]
        unidade_federativa = resultado["unidadeFederativa"]["value"].removeprefix(url_prefix)
        unidade_federativa_label = resultado["unidadeFederativaLabel"]["value"]

        pessoa = pessoas.setdefault(item, {
            "wikidataId": item,
            "name": item_label,
            "occupations": {},
            "birthplaces": {},
        })

        pessoa["occupations"][area_da_musica] = area_da_musica_label
        pessoa["birthplaces"][unidade_federativa] = unidade_federativa_label

    pessoas_formatadas = {}
    for qid, pessoa in pessoas.items():
        occupations = [
            {"qid": occupation_qid, "label": label}
            for occupation_qid, label in sorted(pessoa["occupations"].items())
        ]
        birthplaces = [
            {"qid": birthplace_qid, "label": label, "country": "Brasil"}
            for birthplace_qid, label in sorted(pessoa["birthplaces"].items())
        ]

        pessoas_formatadas[qid] = {
            "wikidataId": pessoa["wikidataId"],
            "name": pessoa["name"],
            "occupations": [occupation["label"] for occupation in occupations],
            "birthplace": birthplaces[0]["label"] if len(birthplaces) == 1 else [
                birthplace["label"] for birthplace in birthplaces
            ],
            "birthplaceQid": birthplaces[0]["qid"] if len(birthplaces) == 1 else [
                birthplace["qid"] for birthplace in birthplaces
            ],
            "sourceFacts": {
                "occupation": occupations,
                "birthplace": birthplaces,
            },
        }

    caminho_saida = Path(__file__).resolve().parent / "pessoas.json"
    with caminho_saida.open("w", encoding="utf-8") as arquivo:
        json.dump(pessoas_formatadas, arquivo, ensure_ascii=False, indent=2)
        arquivo.write("\n")

    print(f"{len(pessoas_formatadas)} pessoas salvas em {caminho_saida}")

except Exception as e:
    print(f"Erro ao executar a query: {e}")