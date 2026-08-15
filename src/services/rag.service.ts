import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import {OllamaEmbeddings} from '@langchain/ollama';
import pool from '../db/pool';
import {env} from '../config/env';
import {ChatOllama} from '@langchain/ollama';


const embeddings=new OllamaEmbeddings({
    model:'nomic-embed-text',
    baseUrl:env.OLLAMA_BASE_URL||'http://localhost:11434'
});

export async function indexDocument(documentId:number,text:string){
    
    const splitter=new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200,
    });

    const chunks=await splitter.splitText(text);

    if(!chunks.length){
        throw new Error('no chunks produced from document text');
    }

    await pool.query('DELETE FROM chunks WHERE document_id=$1',[documentId]);

    for(const content of chunks){
        const vector=await embeddings.embedQuery(content);
        const vectorLiteral=`[${vector.join(',')}]`;

        await pool.query(`INSERT INTO chunks(document_id,content,embedding) values($1,$2,$3::vector)`,[documentId,content,vectorLiteral]);
    }

    return chunks.length;
}


const llm=new ChatOllama({
    model:'qwen2.5:3b',
    baseUrl:env.OLLAMA_BASE_URL||'http://127.0.0.1:11434'
});

export async function askDocument(documentId:number,question:string){
    
    const qVector=await embeddings.embedQuery(question);
    const vectorLiteral=`[${qVector.join(',')}]`;

    const result=await pool.query(
        `SELECT content,embedding<=>$1::vector AS distance FROM chunks WHERE document_id=$2 ORDER BY embedding <=> $1::vector LIMIT 5`,[vectorLiteral,documentId]);

    if(!result.rows.length){
        throw new Error('no chunks found for this document');
    }

    const context=result.rows.map((r:any)=>r.content).join('\n\n--\n\n');
    const prompt=`Answer ONLY using the context below. If the answer is not in the context, say you do not know

    Context:
    ${context}
    Question: ${question}
 Answer:`;


  const response = await llm.invoke(prompt);
  const answer =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  return {
    answer,
    sources: result.rows.map((r: any) => r.content),
  };

}