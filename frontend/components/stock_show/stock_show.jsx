import React from 'react'
import Header from "../header/header_container"
import Loading from '../loading_page/full_page_load'
import Chart from '../chart/chart'
import AddWatchlistButton from '../watchlist_button/add_watch_list_button'
import RemoveWatchlistButton from '../watchlist_button/remove_watch_list_button'
import { withRouter } from 'react-router-dom';
import { addToWatchlist } from '../../util/watchlist_util'
import Unknown from '../loading_page/unknown_stock'
class ShowAndBuyForm extends React.Component{

  constructor(props){
    super(props)
    this.state = {mode: "buy",numShares: "", viewsMode: 30, d:false,w:false,m:true,tm:false,y:false, sbutton: "Submit Order",ssbutton:"Submit Sell Order",specialButton: false}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSellSubmit = this.handleSellSubmit.bind(this)

  }
  

  componentWillMount(){
    this.props.fetchTransactions()
    }


  componentDidUpdate(){
    if (this.props.transactionStatus.msg){
      this.props.fetchTransactions()
      this.setState({
        sbutton: this.props.transactionStatus.msg,
        ssbutton: this.props.transactionStatus.msg,
        specialButton: true,
      })
      setTimeout(()=>this.setState({
        sbutton: "Submit Order",
        ssbutton: "Submit Sell Order",
        specialButton: false,
      }),4000)
    }
    }
  

  update(field){
    return (e) => {
      if (e.target.value > 99999) {
        this.setState({[field]: this.state[field]})  
      } else {
        this.setState({[field]: e.target.value})
      }
    }
  }

  checkWatchlist(){
    let ownership = false
    this.props.watchlist.forEach(el => {
      if (el.nasdaq_code === this.props.match.params.stockCode) {
        ownership = true
      }
    });
    return ownership
  }

  numberWithCommas(x){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  prepData(data){
    //used for deprecated chartkick
    let chartData = {}
    data.forEach(el => {
      chartData[el.date] = el.close
    });
    return chartData
  }

  dataSlice(arr,size){
    if(size === false || size === 1) {
      return arr
    }
    return arr.slice(Math.max(arr.length - size, 1))
  }


  handleSubmit(e){
    e.preventDefault()
    if (!this.checkWatchlist()) {
      addToWatchlist(this.props.user.id, this.props.match.params.stockCode).then(() => this.props.fetchWatchlist(this.props.user.id))
    }
    this.props.sendTransaction({
      category: "buy",
      stock_code: this.props.stock.quote.symbol,
      price: this.props.stock.quote.delayedPrice,
      amount: this.state.numShares
    })
  }

  handleSellSubmit(e){
    e.preventDefault()
    this.props.sendTransaction({
      category: "sell",
      stock_code: this.props.stock.quote.symbol,
      price: this.props.stock.quote.delayedPrice,
      amount: this.state.numShares
    })
  }

  numSharesOwnership(code){
    if (this.props.loading.transactionLoading){
      return "0"
    }
    if (this.props.transactions.open === undefined){
      return "0"
    }
    if (this.props.transactions.open[code] === undefined){
      return "0"
    }
    return this.props.transactions.open[code].stats.holding
  }

  buyForm(){
    return (
    <div id='stock-buy' className=" bsticky stock-buy">
      <h2>
        Buy {this.props.stock.quote.symbol}
      </h2>
      <span></span>
      <div className="bottom-container">
        <div className="share-selector">
          <p>Shares</p>
        </div>
        <div className="market-price">
          <p>Market Price</p>
        </div>
        <span className="divider"></span>

        <div className="estimated-cost">
          <p>Estimated Cost</p>
        </div>
        <div className="estimated-cost share-ownership">
            <p>you have {this.numSharesOwnership(this.props.stock.quote.symbol)} shares of {this.props.stock.quote.symbol}
                  <button onClick={() =>this.setState({ mode: "sell" })}>Sell</button>
          </p>
          
        </div>
        {/* new line here */}
        <form onSubmit={this.handleSubmit}>
            <input className="number-shares-input" onChange={this.update("numShares")} type="number" value={this.state.numShares} />
          <input className={this.state.specialButton ? "buy-button-animate":"buy-button"} type="submit" value={this.state.sbutton} />
        </form>
        <span className="last-divider"></span>
        <div className="buyingPower">${this.numberWithCommas(this.props.user.bankroll)} is Available for Trading</div>
        <div className="markey-price">${this.props.stock.quote.delayedPrice}</div>
        <div className="estimated-cost-calc">${this.numberWithCommas(parseInt(this.props.stock.quote.delayedPrice) * this.state.numShares)}</div>
      </div>


      {this.checkWatchlist() ? (<RemoveWatchlistButton
        user={this.props.user}
        fetchWatchlist={this.props.fetchWatchlist} />) :
        (<AddWatchlistButton
          fetchWatchlist={this.props.fetchWatchlist}
          user={this.props.user} />)}


    </div>)
  }


  sellForm(){
    return (
      <div id='stock-buy' className=" bsticky stock-buy">
        <h2>
          Sell {this.props.stock.quote.symbol}
        </h2>
        <span></span>
        <div className="bottom-container">
          <div className="share-selector">
            <p>Shares</p>
          </div>
          <div className="market-price">
            <p>Market Price</p>
          </div>
          <span className="divider"></span>

          <div className="estimated-cost">
            <p>Estimated Value</p>
          </div>
          <div className="estimated-cost share-ownership">
            <p>you have {this.numSharesOwnership(this.props.stock.quote.symbol)} share of {this.props.stock.quote.symbol}
                  <button onClick={() => this.setState({ mode: "buy" })}>Buy more</button>
            </p>
          </div>
          {/* new line here */}
          <form onSubmit={this.handleSellSubmit}>
            <input className="number-shares-input" onChange={this.update("numShares")} type="number" value={this.state.numShares}/>
            <input className={this.state.specialButton ? "buy-button-animate":"buy-button"} type="submit" value={this.state.ssbutton} />
          </form>
          
          <span className="last-divider"></span>
          <div className="buyingPower">${this.numberWithCommas(this.props.user.bankroll)} is Available for Trading</div>
          <div className="markey-price">${this.props.stock.quote.delayedPrice}</div>
          <div className="estimated-cost-calc">${this.numberWithCommas(parseInt(this.props.stock.quote.delayedPrice) * this.state.numShares)}</div>
        </div>


        {this.checkWatchlist() ? (<RemoveWatchlistButton
          user={this.props.user}
          fetchWatchlist={this.props.fetchWatchlist} />) :
          (<AddWatchlistButton
            fetchWatchlist={this.props.fetchWatchlist}
            user={this.props.user} />)}


      </div>
    )
  }

  render(){
    
    if (this.props.errors.stock == "Unknown symbol"){
      return <Unknown />
    }
    if (this.props.loading.newsLoading || this.props.loading.stockLoading) {
      return <Loading />
    }


    return (
      <div>
        <header>
          <Header />

          <script>

            {document.addEventListener("DOMContentLoaded", () => {
              window.onscroll = function () { myFunction() };
              var navbar = document.getElementById("loggedin-navbar");
              var sticky = navbar.offsetTop;

              function myFunction() {
                if (window.pageYOffset >= sticky) {
                  navbar.classList.add("sticky")
                } else {
                  navbar.classList.remove("sticky");
                }
              }
            })}

          </script>

          <script>

            {document.addEventListener("DOMContentLoaded", () => {
              window.onscroll = function () { myFunction2() };
              var navbar = document.getElementById("stock-buy");
              var sticky = navbar.offsetTop;

              function myFunction2() {
                if (window.pageYOffset >= sticky) {
                  navbar.classList.add("bsticky")
                } else {
                  navbar.classList.remove("bsticky");
                }
              }
            })}

          </script>

          <script>
            {document.addEventListener("DOMContentLoaded", () => {
              window.onscroll = function () { myFunction2() };
              var navbar = document.getElementById("watchlist-button");
              var sticky = navbar.offsetTop;

              function myFunction2() {
                if (window.pageYOffset >= sticky) {
                  navbar.classList.add("lsticky")
                } else {
                  navbar.classList.remove("lsticky");
                }
              }
            })}
          </script>


          <script>
            {document.addEventListener("DOMContentLoaded", ()=>{
              var el = document.getElementsByClassName("range-selected")
            })}

          </script>


        </header>
        <div className="entire-main-body">



          <div className="porfolio-performance">
            <h1>${this.props.stock.quote.delayedPrice}</h1>
            <h2>${this.props.stock.quote.change} ({(this.props.stock.quote.changePercent * 100).toFixed(2)}%)<span>Today</span></h2>
          </div>

          <div className="porfolio-chart">
            <Chart data={this.dataSlice(this.props.stock.chart, this.state.viewsMode) } />

              {/* SPAGHETTI CODE AHEAD, ENTER AT YOUR OWN RISK (it works tho) */}
            <div className="stock-show-span-selectors">
              <p onClick={() => 
              {this.props.fetchCurrentStock(this.props.stock.quote.symbol,"1d",false).then(()=>
                this.setState({ viewsMode: 1 }))
                this.setState({ d: true, w: false, m: false, tm: false, y: false})
              }}
            className={this.state.d ? "range-selected" : null}
              >1D</p>

              <p 
                onClick={() => {
                  this.props.fetchCurrentStock(this.props.stock.quote.symbol, "1y", false).then(() =>
                    this.setState({ viewsMode: 7 }))
                  this.setState({ d: false, w: true, m: false, tm: false, y: false })
                }}
                className={this.state.w ? "range-selected" : null}
              >1W</p>

              <p onClick={() => {
                this.props.fetchCurrentStock(this.props.stock.quote.symbol, "1y", false).then(() =>
                  this.setState({ viewsMode: 30 }))
                this.setState({ d: false, w: false, m: true, tm: false, y: false })
              }}
              className={this.state.m ? "range-selected" : null}
              >1M</p>

              <p onClick={() => {
                this.props.fetchCurrentStock(this.props.stock.quote.symbol, "1y", false).then(() =>
                  this.setState({ viewsMode: 90 }))
                this.setState({ d: false, w: false, m: false, tm: true, y: false })
              }}
              className={this.state.tm ? "range-selected" : null}
              >3M</p>

              <p onClick={() => {
                this.props.fetchCurrentStock(this.props.stock.quote.symbol, "1y", false).then(() =>
                  this.setState({ viewsMode: false }))
                this.setState({ d: false, w: false, m: false, tm: false, y: true })
              }}
              className={this.state.y ? "range-selected" : null}
              >1Y</p>
            </div>
          </div>
          {/* 22 Articles in here */}
          <div className="news-list">
            <h1>Recent News</h1>
            <div>
              <ul>
                {this.props.news}
              </ul>
            </div>
          </div>



          {this.state.mode === "buy" ? this.buyForm() : this.sellForm()}

        </div>

      </div>
    )
  }

}




export default withRouter(ShowAndBuyForm)
