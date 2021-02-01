import React, { useState } from 'react';

import './global.css';

function App() {
  const documentText = 'O Sr. e a Sra. Dursley, da rua dos Alfeneiros, no 4, se orgulhavam de dizer que eram perfeitamente normais, muito bem, obrigado. Eram as últimas pessoas no mundo que se esperaria que se metessem em alguma coisa estranha ou misteriosa, porque simplesmente não compactuavam com esse tipo de bobagem.  O Sr. Dursley era diretor de uma firma chamada Grunnings, que fazia perfurações. Era um homem alto e corpulento quase sem pescoço, embora tivesse enormes bigodes. A Sra. Dursley era magra e loura e tinha um pescoço quase duas vezes mais comprido que o normal, o que era muito útil porque ela passava grande parte do tempo espichando-o por cima da cerca do jardim para espiar os vizinhos. Os Dursley tinham um filhinho chamado Dudley, o Duda, e em sua opinião não havia garoto melhor em nenhum lugar do mundo. Os Dursley tinham tudo que queriam, mas tinham também um segredo, e seu maior receio era que alguém o descobrisse. Achavam que não iriam aguentar se alguém descobrisse a existência dos Potter. A Sra. Potter era irmã da Sra. Dursley, mas não se viam havia muitos anos; na realidade a Sra. Dursley fingia que não tinha irmã, porque esta e o marido imprestável eram o que havia de menos parecido possível com os Dursley. Eles estremeciam só de pensar o que os vizinhos iriam dizer se os Potter aparecessem na rua. Os Dursley sabiam que os Potter tinham um filhinho, também, mas nunca o tinham visto. O garoto era mais uma razão para manter os Potter a distância; eles não queriam que Duda se misturasse com uma criança daquelas.';
  
  const [ marker, setMarker ] = useState({
    name: '',
    index: null
  });
  const [ markedDocument, setMarkedDocument ] = useState(splitText( documentText ));
  const [ markerType, setMarkerType ] = useState([
    {
      name: 'person',
      color: 'yellow',
      content: ['oi']
    },
    {
      name: 'action',
      color: 'pink',
      content: []
    },
    {
      name: 'value',
      color: 'greenyellow',
      content: []
    },
    {
      name: 'object',
      color: 'lightblue',
      content: []
    }
  ]);
  
  document.onmouseup = selectText;
  
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
        markerIndex: 0
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
        marker.name != ''){    
      newTextMarked(selectedText);
    }
  }

  function newTextMarked(selection) {
    let selectedText = selection.toString();
    let startIndex = parseInt(selection.baseNode.parentElement.id);
    let endIndex = startIndex + selectedText.split(' ').length - 1; 
    
    console.log(
      selection, 
      selectedText, 
      startIndex, endIndex,
      
      );
    let markedText = '';
    let copy = markedDocument;
    for (let index = startIndex; index <= endIndex; index++) {
      markedText += copy[index].text;
      // if(markedDocument[index].marker == marker.name){ //se marcado remover da pilha // tbm remover caso marcado com outra

      //   copy[index].marker = '';
      //   copy[index].color = '';
      //   setMarkedDocument(copy);
      // } 
      // else if(markedDocument[index].marker != ''){ //remover da lista do marcador antigo

        // copyMarker = markerType[marker.index].content;
        // copyMarker.splice(copy[index].markerIndex, 1);

      //   switch (copy[index].marker) {
      //     case 'person':
      //       copyMarker = person; copyMarker.splice(copy[index].markerIndex, 1); setPerson(copyMarker);
      //       break;
      //     case 'action':
      //       copyMarker = action; copyMarker.splice(copy[index].markerIndex, 1); setAction(copyMarker);
      //       break;
      //     case 'value':
      //       copyMarker = value; copyMarker.splice(copy[index].markerIndex, 1); setValue(copyMarker);
      //       break;
      //     case 'object':
      //       copyMarker = object; copyMarker.splice(copy[index].markerIndex, 1); setObject(copyMarker);
      //       break;
      //   }
      //   console.log(copyMarker);
      }
    // }//remover
    //   if(markedDocument[index].marker != marker){
    //     copy[index].marker = marker;
    //     switch (marker) {
    //       case 'person':
    //         copy[index].color = 'yellow'; copy[index].markerIndex = person.length - 1 ; break;
    //       case 'action':
    //         copy[index].color = 'pink'; copy[index].markerIndex = action.length - 1; break;
    //       case 'value':
    //         copy[index].color = 'greenyellow'; copy[index].markerIndex = value.length - 1; break;
    //       case 'object':
    //         copy[index].color = 'lightblue'; copy[index].markerIndex = object.length - 1; break;
    //     }
    //     setMarkedDocument(copy);
    //   }
    // }
    // let obj = {
    //   text: markedText
    // }
    // switch (marker) {
    //   case 'person':
    //     setPerson([...person, obj]); break;
    //   case 'action':
    //     setAction([...action, obj]); break;
    //   case 'value':
    //     setValue([...value, obj]); break;
    //   case 'object':
    //     setObject([...object, obj]); break;
    // }
  }

  return (
    <div className="textAnalyzer">
      <div>
        <h3>Documento</h3>
        <span id="documentText">
          {markedDocument.map((word, index) =>(
              <span className="markedDocument" id={index} style={{background: word.color}} key={index}>
                {word.text}
              </span>
            ))}
        </span>
      </div>
      <div>
        <h3>Marcadores</h3>
        <p>MARCADOR SELECIONADO: {marker.name}</p>

        <div className="markers">

            {markerType.map((currentMarker, index) => 
              <div>
                <button key={index} style={{background: currentMarker.color}} value={currentMarker.name} onClick={e => selectMarker(index)}>
                  {currentMarker.name}
                </button>
                  {currentMarker.content.map((content, index2) =>
                    <p key={index2}>
                      ({index2}) {content}
                    </p>)}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
