import React from "react";
import web3 from "./web3";
import lottery from './lottery';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      manager:'',
      players:[],
      balance:'',
      value:'',
      message:''
    }
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players= await lottery.methods.getPlayers().call();
    const balance=await web3.eth.getBalance(lottery.options.address);
    this.setState({
      manager:manager,
      players:players,
      balance:balance
    })
  }
  handleInputChange=(e)=>{
    this.setState({
      value:e.target.value
    })
  }
  handleSubmit=async (event)=>{
    event.preventDefault();
    const accounts=await web3.eth.getAccounts();

    this.setState({message:"Waiting on transaction success...."});
    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:"You have entered the lottery!"});
  }

  handlePickWinner=async()=>{
    const accounts=await web3.eth.getAccounts();

    this.setState({message:"Picking a winner...."});
    await lottery.methods.pickWinner().send({
      from:accounts[0],
    });
    this.setState({message:"Winner has been picked"});
  }

  render() {
    return (
      <div className="App">
        <h2>This is our lottery contract</h2>
        <p>This contract is managed by {this.state.manager} <br />
           There are currently {this.state.players.length} person entered to win {web3.utils.fromWei(this.state.balance,'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.handleSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>AMOUNT OF ETHER TO ENTER</label>
              <input onChange={this.handleInputChange} value={this.state.value}/>
            </div>
            <button>Enter</button>
        </form>
        <hr/>
          <h4>Ready To Pick A Winner?</h4>
          <button onClick={this.handlePickWinner}>Pick A Winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
