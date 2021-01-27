import React, { useState } from 'react';

import './global.css';

function App() {
  const documentText = 'O Sr. e a Sra. Dursley, da rua dos Alfeneiros, no 4, se orgulhavam de dizer que eram perfeitamente normais, muito bem, obrigado. Eram as últimas pessoas no mundo que se esperaria que se metessem em alguma coisa estranha ou misteriosa, porque simplesmente não compactuavam com esse tipo de bobagem.  O Sr. Dursley era diretor de uma firma chamada Grunnings, que fazia perfurações. Era um homem alto e corpulento quase sem pescoço, embora tivesse enormes bigodes. A Sra. Dursley era magra e loura e tinha um pescoço quase duas vezes mais comprido que o normal, o que era muito útil porque ela passava grande parte do tempo espichando-o por cima da cerca do jardim para espiar os vizinhos. Os Dursley tinham um filhinho chamado Dudley, o Duda, e em sua opinião não havia garoto melhor em nenhum lugar do mundo. Os Dursley tinham tudo que queriam, mas tinham também um segredo, e seu maior receio era que alguém o descobrisse. Achavam que não iriam aguentar se alguém descobrisse a existência dos Potter. A Sra. Potter era irmã da Sra. Dursley, mas não se viam havia muitos anos; na realidade a Sra. Dursley fingia que não tinha irmã, porque esta e o marido imprestável eram o que havia de menos parecido possível com os Dursley. Eles estremeciam só de pensar o que os vizinhos iriam dizer se os Potter aparecessem na rua. Os Dursley sabiam que os Potter tinham um filhinho, também, mas nunca o tinham visto. O garoto era mais uma razão para manter os Potter a distância; eles não queriam que Duda se misturasse com uma criança daquelas.';
  
  const [ marker, setMarker ] = useState('');
  const [ person, setPerson ] = useState([]);
  const [ action, setAction ] = useState([]);
  const [ value,  setValue  ] = useState([]);
  const [ object, setObject ] = useState([]);
  const [ markedDocument, setMarkedDocument ] = useState(splitText( documentText ));
  
  document.onmouseup = selectText;
  
  function selectMarker( markerValue ) {
    if( marker === markerValue ) setMarker( '' );
    else setMarker( markerValue );
  }

  function splitText( text ){
    let wordArray =  text.split(' ');
    let charIndex = 0;
    wordArray.forEach( ( word, index ) => {
      let obj = {
        text: `${word} `,
        marker: '',
        indexStart: charIndex,
        color: ''
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
        marker != ''){    
      newTextMarked(selectedText);
    }
  }

  function newTextMarked(selection) {
    let selectedText = selection.toString();
    let startIndex = parseInt(selection.baseNode.parentElement.id);
    let endIndex = startIndex + selectedText.split(' ').length - 1; 
    let obj = {
      text: selectedText
    }

    // if( selection.focusOffset < selection.baseOffset ){ //caso a selecao ocorra de tras pra frente
    //   endIndex = startIndex;
    //   startIndex = endIndex - selectedText.split(' ').length;
    // }
    
    console.log(
      selection, 
      selectedText, 
      startIndex, endIndex,
      
      );

    for (let index = startIndex; index <= endIndex; index++) {
      let copy = markedDocument;
      if(markedDocument[index].marker == marker){ //se marcado remover da pilha // tbm remover caso marcado com outra
        copy[index].marker = '';
        copy[index].color = '';
        setMarkedDocument(copy);
      } else {
        copy[index].marker = marker;
        switch (marker) {
          case 'person':
            copy[index].color = 'yellow'; break;
          case 'action':
            copy[index].color = 'pink'; break;
          case 'value':
            copy[index].color = 'greenyellow'; break;
          case 'object':
            copy[index].color = 'lightblue'; break;
        }
        setMarkedDocument(copy);
      }
    }

    switch (marker) {
      case 'person':
        setPerson([...person, obj]); break;
      case 'action':
        setAction([...action, obj]); break;
      case 'value':
        setValue([...value, obj]); break;
      case 'object':
        setObject([...object, obj]); break;
    }
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
        <p>Marcador selecionado: {marker}</p>

        <div className="markers">
          <button className="personMarker" value="person" onClick={e => selectMarker(e.target.value)}>Pessoa</button>
          <span>
            {person.map((person, index) =>(
              <p key={index}>
                ({index}) {person.text}
              </p>
            ))}
          </span>

          <button className="actionMarker" value="action"   onClick={e => selectMarker(e.target.value)}>Ação</button>
          <span>
            {action.map((action, index) =>(
              <p key={index}>
                ({index}) {action.text}
              </p>
            ))}
          </span>

          <button className="valueMarker"  value="value"  onClick={e => selectMarker(e.target.value)}>Valor</button>
          <span>
            {value.map((value, index) =>(
              <p key={index}>
                ({index}) {value.text}
              </p>
            ))}
          </span>

          <button className="objectMarker" value="object" onClick={e => selectMarker(e.target.value)}>Objeto</button>
          <span>
            {object.map((object, index) =>(
              <p key={index}>
                ({index}) {object.text}
              </p>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
