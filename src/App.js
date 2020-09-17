import React from 'react';
import './App.css';
import Cell from './Cell';

class App extends React.Component {
  
  constructor(){
    super();
    this.state = {
      cells: [],
      boardSize: 30,
      frecuency: 5000,
      iteration: null,
    }
  };

  componentDidMount = () => {
    this.generateBoard();
  }
  
  generateBoard = () => {
    const { boardSize } = this.state;
    const cells = [];
    for(let i = 0; i < (boardSize * boardSize); i++){
      cells.push({
        id: i,
        isAlive: false
      });
    }
    this.setState({ cells, iteration: null })
  };

  generateTrs = () => {
    const { cells, boardSize } = this.state;
    return cells.map((_, i) => {
      if(i === 0 || i % boardSize === 0){
        return (<tr key={`td_${i}`}>{this.generateTds(i, cells.slice(i, Number(i)+Number(boardSize)))}</tr>); // `
      }
      return null;
    })
  };

  generateTds = (parentId, cellSubArray) => {
    return cellSubArray.map((cell, i) => {
      const cellId = parentId + i;
      return (<Cell 
        key={`cell_${cellId}`} // `
        id={cellId} 
        isAlive={cell.isAlive} 
        handleClick={() => this.clickCell(cellId)} 
      />)
    })
  };

  clickCell = cellId => {
    const { cells } = this.state;

    const newCells = cells.map(cell => {
      const newCell = {...cell};
      if(newCell.id === cellId) {
        newCell.isAlive = !newCell.isAlive;
      }
      return newCell;
    });

    this.setState({ cells: newCells });
  };

  beginGame = () => {
    const { iteration } = this.state;
    if (iteration) {
      clearTimeout(iteration);
      this.setState({ iteration: null });
    } else {
      this.live();
    }
  }

  live = () => {
    this.refreshBoard();
    this.repeat();
  };

  refreshBoard = () => {
    const { cells } = this.state;
    const newCells = cells.map(cell => {
      const newCell = {...cell};
      const neighbors = this.getNeighbors(cell);
      const aliveNeighbors = neighbors.filter(neighbors => neighbors.isAlive);
      
      // Any live cell with fewer than two live neighbours dies, as if by underpopulation
      // Any live cell with more than three live neighbours dies, as if by overpopulation
      if(cell.isAlive && (aliveNeighbors.length < 2 || aliveNeighbors.length > 3)) {
        newCell.isAlive = false;
      }
      
      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if(!cell.isAlive && aliveNeighbors.length === 3) {
        newCell.isAlive = true;
      }
      // Any live cell with two or three live neighbours lives on to the next generation
      // Do nothing

      return newCell;
    });
    this.setState({ cells: newCells });
  };
  

  repeat = () => {
    const { frecuency } = this.state;
    const iteration = setTimeout( () => this.live(), frecuency);
    this.setState({ iteration })
  };

  getNeighbors = cell => {
    const { cells, boardSize } =  this.state;
    const neighbors = [];

    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id-(boardSize+1)));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id-boardSize));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id-(boardSize-1)));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id-1));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id+1));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id+(boardSize+1)));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id+boardSize));
    neighbors.push(cells.find(neighborCell => neighborCell.id === cell.id+(boardSize-1)));
    
    return neighbors.filter(n => n !== undefined);
  }

  render() {
    const { cells, iteration, boardSize } = this.state;

    return (
      <div className="App">
        <div>
          <input 
            type="text" 
            value={boardSize} 
            onChange={e => this.setState({ boardSize: Number(e.target.value) })} 
            placeholder="board size: 10" 
          />
          <button onClick={this.generateBoard}>Generate Board</button>
        </div>
        <div>
        <input type="text" value={this.state.frecuency} onChange={e => this.setState({ frecuency: e.target.value })} placeholder="Frecuency: 1000" />
          <button onClick={this.beginGame}>{iteration ? 'Stop Game' :  'Start Game'}</button>
        </div>

        {cells && cells.length > 0 &&
          <table cellSpacing="0">
            <tbody>
              {this.generateTrs()}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default App;
