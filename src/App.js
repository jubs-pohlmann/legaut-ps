import React, { useState } from 'react';

import './global.css';

function App() {
  const documentText = 'O Sr. e a Sra. Dursley, da rua dos Alfeneiros, no 4, se orgulhavam de dizer que eram perfeitamente normais, muito bem, obrigado. Eram as últimas pessoas no mundo que se esperaria que se metessem em alguma coisa estranha ou misteriosa, porque simplesmente não compactuavam com esse tipo de bobagem.  O Sr. Dursley era diretor de uma firma chamada Grunnings, que fazia perfurações. Era um homem alto e corpulento quase sem pescoço, embora tivesse enormes bigodes. A Sra. Dursley era magra e loura e tinha um pescoço quase duas vezes mais comprido que o normal, o que era muito útil porque ela passava grande parte do tempo espichando-o por cima da cerca do jardim para espiar os vizinhos. Os Dursley tinham um filhinho chamado Dudley, o Duda, e em sua opinião não havia garoto melhor em nenhum lugar do mundo. Os Dursley tinham tudo que queriam, mas tinham também um segredo, e seu maior receio era que alguém o descobrisse. Achavam que não iriam aguentar se alguém descobrisse a existência dos Potter. A Sra. Potter era irmã da Sra. Dursley, mas não se viam havia muitos anos; na realidade a Sra. Dursley fingia que não tinha irmã, porque esta e o marido imprestável eram o que havia de menos parecido possível com os Dursley. Eles estremeciam só de pensar o que os vizinhos iriam dizer se os Potter aparecessem na rua. Os Dursley sabiam que os Potter tinham um filhinho, também, mas nunca o tinham visto. O garoto era mais uma razão para manter os Potter a distância; eles não queriam que Duda se misturasse com uma criança daquelas.';
  const [ marker, setMarker ] = useState( { name: '', index: null } );
  const [ markedDocument, setMarkedDocument ] = useState(splitText( documentText ));
  const [ markerType, setMarkerType ] = useState([
    { name: 'person', color: 'yellow',      content: {} },
    { name: 'action', color: 'pink',        content: {} },
    { name: 'value',  color: 'greenyellow', content: {} },
    { name: 'object', color: 'lightblue',   content: {} }
  ]);
  const [ newMarker,    setNewMarker   ] = useState('');
  const [ markerColor,  setMarkerColor ] = useState('');
  
  document.onmouseup = selectText;

  async function handleSubmit(e){
    e.preventDefault(); //impede refresh da tela
    let temp = markerType;
    temp.push({
      name: newMarker,
      color: markerColor,
      content: {}
    });
    setMarkerType(temp);
    setNewMarker(''); setMarkerColor(''); setMarker({ name: '', index: null });
  }
  
  function selectMarker( markerValue ) {
    if( marker.index === markerValue ) setMarker({ name: '', index: null });
    else setMarker({ name:markerType[markerValue].name, index: markerValue });
  }

  function splitText( text ){
    let wordArray =  text.split(' ');
    let charIndex = 0;
    wordArray.forEach( ( word, index ) => {
      let obj = {
        text: `${word} `,
        marker: '',
        indexStart: charIndex,
        color: '',
        markerId: 0
      }
      charIndex += word.length + 1; 
      wordArray[index] = obj;
    });
    return wordArray;
  }

  function selectText( e ) {
    let selectedText =  document.getSelection();
    if( selectedText.baseNode &&
        selectedText.baseNode.parentElement.className === 'markedDocument' &&
        selectedText.toString().length > 0 &&
        marker.name !== ''){    
      newTextMarked(selectedText);
    }
  }

  function addTextToMarkerList( text, id ){
    let temp = markerType;
    temp[marker.index].content[id] = text;
    setMarkerType(temp);
  }

  function removeFromMarkerList(markerId, markerName){
    let markerTypeCopy = markerType;
    let documentCopy = markedDocument;

    const foundIndex = markerType.findIndex(element => element.name === markerName); //removendo da lista 
    delete markerTypeCopy[foundIndex].content[markerId];

    markerId = markerId.split('/');
    for (let index = parseInt(markerId[0]); index <= parseInt(markerId[1]); index++) { //descolorindo o documento
      documentCopy[index].marker = '';
      documentCopy[index].color = ''; 
      documentCopy[index].markerId = 0; 
    }

    setMarkedDocument(documentCopy);
  }

  function fixSelection(selection){
    let startSelection = parseInt(selection.baseNode.parentElement.id);
    let endSelection = parseInt(selection.focusNode.parentElement.id);
    if(startSelection > endSelection){
      let temp = startSelection;
      startSelection = endSelection;
      endSelection = temp;
    }
    return [startSelection, endSelection];
  }

  function newTextMarked(selection) {
    let start_end = fixSelection(selection); //todo
    let startIndex = start_end[0];
    let endIndex = start_end[1]; 
    let markedText = '';
    let documentCopy = markedDocument;

    let id = `${startIndex}/${endIndex}`;
    let previousContentMarkerId = 0;
    for (let index = startIndex; index <= endIndex; index++) {
      markedText += documentCopy[index].text; //formando a frase marcada
      
      if(markedDocument[index].markerId !== previousContentMarkerId){ //removendo a marcacao do texto selecionado caso ja houvesse
        previousContentMarkerId = markedDocument[index].markerId;
        if(markedDocument[index].marker !== '' ) removeFromMarkerList(previousContentMarkerId, markedDocument[index].marker);
      } 

      if(markedDocument[index].marker !== marker.name){ //palavra nao ja estava marcada com aquele marcador
        documentCopy[index].marker = marker.name;
        documentCopy[index].color = markerType[marker.index].color; 
        documentCopy[index].markerId = id; 
      }
    }
    setMarkedDocument(documentCopy);
    addTextToMarkerList(markedText, id);
    setMarker( { name: '', index: null } ); //selecao so finaliza quando muda o marcador (??)
  }

  return (
    <div className="textAnalyzer">
      <div className="textAnalyzerColumn">
        <h3>Documento</h3>
        <span id="documentText">
          {markedDocument.map((word, index) =>(
              <span className="markedDocument" id={index} style={{background: word.color}} key={index}>
                {word.text}
              </span>
            ))}
        </span>
      </div>
      <div className="textAnalyzerColumn">
        <h3>Marcadores</h3>
        
        <form onSubmit={handleSubmit}>
          <label>Nome do Novo Marcador
            <input type="text" value={newMarker} onChange={e => setNewMarker(e.target.value)} />
          </label>
          <br/>
          <label>Cor do Novo Marcador
            <input type="text" value={markerColor} onChange={e => setMarkerColor(e.target.value)} />
          </label>
          <button type="submit">Inserir nova tag</button>
        </form>

        <p>MARCADOR SELECIONADO: {marker.name}</p>
        <div className="markers">
          {markerType.map((currentMarker, index) => 
            <div key={index}>
              <button key={"button"+index} style={{background: currentMarker.color}} value={currentMarker.name} onClick={e => selectMarker(index)}>
                {currentMarker.name}
              </button>
              {Object.entries(currentMarker.content).map(([key, value]) =>
                <p key={index + `${key}`}>
                  -{value}
                </p>)}
            </div>)}
        </div>
      </div>
    </div>
  );
}

export default App;