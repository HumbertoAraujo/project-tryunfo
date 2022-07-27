import React from 'react';
import Card from './components/Card';
import Form from './components/Form';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cardName: '',
      cardDescription: '',
      cardAttr1: '',
      cardAttr2: '',
      cardAttr3: '',
      cardImage: '',
      cardRare: '',
      cardTrunfo: false,
      isSaveButtonDisabled: true,
      cardList: [],
      cardListFiltered: [],
      nameFilter: '',
      rareFilter: 'todas',
      inputsFilterDisable: false,
    };
  }

  onInputChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [name]: value }, () => {
      const {
        cardName, cardDescription, cardAttr1, cardAttr2, cardAttr3, cardImage, cardRare,
      } = this.state;
      const v1 = parseInt(cardAttr1, 10);
      const v2 = parseInt(cardAttr2, 10);
      const v3 = parseInt(cardAttr3, 10);
      const inputs = [
        v1, v2, v3, cardName, cardDescription, cardImage, cardRare,
      ];
      const vMax = 90; const sumMax = 210;
      if (
        (inputs.every((e) => e !== '')
        && (v1 <= vMax && v2 <= vMax && v3 <= vMax)
        && (v1 >= 0 && v2 >= 0 && v3 >= 0)
        && ((v1 + v2 + v3) <= sumMax))) {
        this.setState({ isSaveButtonDisabled: false });
      } else {
        this.setState({ isSaveButtonDisabled: true });
      }
    });
  }

  onSaveButtonClick = () => {
    const { cardName, cardDescription, cardAttr1, cardAttr2, cardAttr3, cardImage,
      cardRare, cardTrunfo,
    } = this.state;
    const arrayInfo = [cardName, cardDescription, cardAttr1, cardAttr2, cardAttr3,
      cardImage, cardRare, cardTrunfo,
    ];
    const newObjectCard = {
      cardName: arrayInfo[0],
      cardDescription: arrayInfo[1],
      cardAttr1: arrayInfo[2],
      cardAttr2: arrayInfo[3],
      cardAttr3: arrayInfo[4],
      cardImage: arrayInfo[5],
      cardRare: arrayInfo[6],
      cardTrunfo: arrayInfo[7],
    };
    this.setState((prevState) => ({
      cardList: [...prevState.cardList, newObjectCard] }));
    this.setState(() => ({
      cardName: '',
      cardDescription: '',
      cardAttr1: '0',
      cardAttr2: '0',
      cardAttr3: '0',
      cardImage: '',
      cardRare: 'normal',
      cardTrunfo: false,
    }));
  }

  removeCard = (event) => {
    event.preventDefault();
    const { target } = event;
    const { cardList } = this.state;
    const cardFilter = cardList.filter((e) => e.cardName !== target.name);
    this.setState(() => ({
      cardList: cardFilter,
    }));
  }

  filterName = (event) => {
    event.preventDefault();
    const { target } = event;
    const { cardList, rareFilter } = this.state;
    if (rareFilter !== 'todas') {
      const arrayRareFilter = cardList.filter((e) => e.cardRare === rareFilter);
      const cardFilter = arrayRareFilter.filter((e) => e.cardName.includes(target.value));
      this.setState(() => ({
        nameFilter: target.value,
        cardListFiltered: cardFilter,
      }));
    } else {
      const cardFilter = cardList.filter((e) => e.cardName.includes(target.value));
      this.setState(() => ({
        nameFilter: target.value,
        cardListFiltered: cardFilter,
      }));
    }
  }

  filterRare = (event) => {
    event.preventDefault();
    const { target } = event;
    this.setState(() => ({
      rareFilter: target.value,
    }), () => {
      const { cardList, nameFilter, rareFilter } = this.state;
      if (rareFilter !== 'todas') {
        const cardFilter = cardList.filter((e) => e.cardRare === rareFilter);
        const cardfilterName = cardFilter.filter((e) => e.cardName.includes(nameFilter));
        this.setState(() => ({
          cardListFiltered: cardfilterName,
        }));
      } else {
        const cardfilterName = cardList.filter((e) => e.cardName.includes(nameFilter));
        this.setState(() => ({
          cardListFiltered: cardfilterName,
        }));
      }
    });
  }

  checkSuper = ({ target }) => {
    const { cardList } = this.state;
    this.setState({
      inputsFilterDisable: target.checked,
    }, () => {
      this.setState(() => ({
        cardListFiltered: cardList.filter((e) => e.cardTrunfo === true),
      }));
    });
  }

  render() {
    const { cardName, cardDescription, cardAttr1, cardAttr2, cardAttr3,
      cardImage, cardRare, cardTrunfo, cardList, nameFilter, cardListFiltered, rareFilter,
      isSaveButtonDisabled, inputsFilterDisable } = this.state;
    return (
      <div>
        <h1>Tryunfo</h1>
        <Form
          cardName={ cardName }
          cardDescription={ cardDescription }
          cardAttr1={ cardAttr1 }
          cardAttr2={ cardAttr2 }
          cardAttr3={ cardAttr3 }
          cardImage={ cardImage }
          cardRare={ cardRare }
          cardTrunfo={ cardTrunfo }
          hasTrunfo={ cardList.some((e) => e.cardTrunfo === true) }
          isSaveButtonDisabled={ isSaveButtonDisabled }
          onInputChange={ this.onInputChange }
          onSaveButtonClick={ this.onSaveButtonClick }
        />
        <input
          type="text"
          name="name-filter"
          data-testid="name-filter"
          onChange={ this.filterName }
          disabled={ inputsFilterDisable }
        />
        <select
          data-testid="rare-filter"
          onChange={ this.filterRare }
          name="cardRare"
          disabled={ inputsFilterDisable }
        >
          <option>todas</option>
          <option>normal</option>
          <option>raro</option>
          <option>muito raro</option>
        </select>
        <input type="checkbox" data-testid="trunfo-filter" onChange={ this.checkSuper } />
        <Card
          cardName={ cardName }
          cardDescription={ cardDescription }
          cardAttr1={ cardAttr1 }
          cardAttr2={ cardAttr2 }
          cardAttr3={ cardAttr3 }
          cardImage={ cardImage }
          cardRare={ cardRare }
          cardTrunfo={ cardTrunfo }
        />
        <section>
          { nameFilter === '' && rareFilter === 'todas' && !inputsFilterDisable ? (
            cardList.map((e) => (
              <div key={ e.cardName }>
                <Card
                  cardName={ e.cardName }
                  cardDescription={ e.cardDescription }
                  cardAttr1={ e.cardAttr1 }
                  cardAttr2={ e.cardAttr2 }
                  cardAttr3={ e.cardAttr3 }
                  cardImage={ e.cardImage }
                  cardRare={ e.cardRare }
                  cardTrunfo={ e.cardTrunfo }
                  key={ e.cardName }
                />
                <button
                  type="button"
                  name={ e.cardName }
                  data-testid="delete-button"
                  onClick={ this.removeCard }
                >
                  Excluir
                </button>
              </div>
            ))) : (
            cardListFiltered.map((element) => (
              <div key={ element.cardName }>
                <Card
                  cardName={ element.cardName }
                  cardDescription={ element.cardDescription }
                  cardAttr1={ element.cardAttr1 }
                  cardAttr2={ element.cardAttr2 }
                  cardAttr3={ element.cardAttr3 }
                  cardImage={ element.cardImage }
                  cardRare={ element.cardRare }
                  cardTrunfo={ element.cardTrunfo }
                  key={ element.cardName }
                />
                <button
                  type="button"
                  name={ element.cardName }
                  data-testid="delete-button"
                  onClick={ this.removeCard }
                >
                  Excluir
                </button>
              </div>
            )))}
        </section>
      </div>
    );
  }
}
export default App;
