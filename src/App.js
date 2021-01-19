import React, { useState } from 'react';

import './global.css';

function App() {
  const [ marker, setMarker ] = useState('');
  const [ person, setPerson ] = useState([]);
  const [ action, setAction ] = useState([]);
  const [ value,  setValue  ] = useState([]);
  const [ object, setObject ] = useState([]);

  document.onmouseup = selectText;

  function selectMarker(markerValue) {
    if(marker === markerValue) setMarker('');
    else setMarker(markerValue);
  }

  function selectText(e) {
    let selectedText =  document.getSelection();
    if( selectedText.baseNode.parentElement.id === 'documentText' &&
        selectedText.toString().length > 0){    
      newTextMarked(selectedText);
    }
  }

  function newTextMarked(selection) {
    let obj = {
      text: selection.toString(),
      docStart: selection.baseOffset,
      docEnd: selection.focusOffset
    }
    switch (marker) {
      case 'pessoa':
        setPerson([...person, obj]);
        break;
      case 'ação':
        setAction([...action, obj]);
        break;
      case 'valor':
        setValue([...value, obj]);
        break;
      case 'objeto':
        setObject([...object, obj]);
        break;
      default:
        break;
    }
  }

  return (
    <div className="textAnalyzer">
      <div>
        <h3>Documento</h3>
        <span id="documentText">O Sr. e a Sra. Dursley, da rua dos Alfeneiros, no 4, se orgulhavam de dizer que eram
              perfeitamente normais, muito bem, obrigado. Eram as últimas pessoas no mundo que se
              esperaria que se metessem em alguma coisa estranha ou misteriosa, porque simplesmente não
              compactuavam com esse tipo de bobagem. 
              O Sr. Dursley era diretor de uma firma chamada Grunnings, que fazia perfurações. Era um
              homem alto e corpulento quase sem pescoço, embora tivesse enormes bigodes. A Sra. Dursley
              era magra e loura e tinha um pescoço quase duas vezes mais comprido que o normal, o que era
              muito útil porque ela passava grande parte do tempo espichando-o por cima da cerca do
              jardim para espiar os vizinhos. Os Dursley tinham um filhinho chamado Dudley, o Duda, e em
              sua opinião não havia garoto melhor em nenhum lugar do mundo.
              Os Dursley tinham tudo que queriam, mas tinham também um segredo, e seu maior receio
              era que alguém o descobrisse. Achavam que não iriam aguentar se alguém descobrisse a
              existência dos Potter. A Sra. Potter era irmã da Sra. Dursley, mas não se viam havia muitos
              anos; na realidade a Sra. Dursley fingia que não tinha irmã, porque esta e o marido
              imprestável eram o que havia de menos parecido possível com os Dursley. Eles estremeciam
              só de pensar o que os vizinhos iriam dizer se os Potter aparecessem na rua. Os Dursley sabiam
              que os Potter tinham um filhinho, também, mas nunca o tinham visto. O garoto era mais uma
              razão para manter os Potter a distância; eles não queriam que Duda se misturasse com uma
              criança daquelas.
        </span>
      </div>
      <div>
        <h3>Marcadores</h3>
        <p>Marcador selecionado: {marker}</p>

        <div className="markers">
          <button id="personMarker" value="pessoa" onClick={e => selectMarker(e.target.value)}>Pessoa</button>
          <span>
            {person.map((person, index) =>(
              <p key={index}>
                {index}: {person.text}
              </p>
            ))}
          </span>

          <button id="actionMarker" value="ação"   onClick={e => selectMarker(e.target.value)}>Ação</button>
          <span>
            {action.map((action, index) =>(
              <p key={index}>
                {index}:{action.text}
              </p>
            ))}
          </span>

          <button id="valueMarker"  value="valor"  onClick={e => selectMarker(e.target.value)}>Valor</button>
          <span>
            {value.map((value, index) =>(
              <p key={index}>
                {index}:{value.text}
              </p>
            ))}
          </span>

          <button id="objectMarker" value="objeto" onClick={e => selectMarker(e.target.value)}>Objeto</button>
          <span>
            {object.map((object, index) =>(
              <p key={index}>
                {index}:{object.text}
              </p>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
