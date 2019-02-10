import {connect} from 'react-redux'
import React from 'react'
import { getNews } from "../../actions/news_actions"
import MainPage from './main_page'
import { clearSearch } from '../../actions/search_actions';
import { fetchWatchlist } from "../../actions/watchlist_actions"
import { fetchStockData } from '../../actions/stocks_actions'
import { fetchTransactions,fetchTransactionsMain } from "../../actions/transaction_actions"
import { updateChartDisplay } from '../../actions/chart_actions'

class Main extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getNews()
    this.props.getWatchlist(this.props.currentUser.id)
    this.props.watchlist.forEach(stockItem => {
      this.props.fetchStockData(stockItem.nasdaq_code)
    });
  }
  
  content() {

    if (Object.keys(this.props.news).length === 0) {
      return null
    }
    const news = Object.values(this.props.news).map((el, idx) => {
  return (
        <a href={el.url} key={idx}>
          <img src={el.urlToImage} />
          <h2>{el.title}</h2>
          <p>{el.description}</p>
        </a>
      )
    })

    return news
  }

  componentDidUpdate(prevProps) {

    this.props.clearSearch()
    if (Object.values(prevProps.data).length === 0){
      this.props.watchlist.forEach(stockItem => {
        this.props.fetchStockData(stockItem.nasdaq_code)
      });
    }
  }

  render() {

    return <MainPage 
    data={this.props.data} 
    watchlist={this.props.watchlist} 
    news={this.content()} 
    loading={this.props.loaded} 
    currentUser={this.props.currentUser}
    stock={this.props.stock}
    fetchTransactions={this.props.fetchTransactions}
    transactionLoading={this.props.transactionLoading}
    transactions={this.props.transactions}
    updateChartDisplay={this.props.updateChartDisplay}
    fetchTransactionsMain={this.props.fetchTransactionsMain}
    />
  }

}


const mapStateToProps = ({entities:{user,watchlist, stockData, currentStock,transactions}, entities:{news,portfolio}, ui:{loading}}) => {
  return {
    currentUser: user,
    news,
    loading: loading.newsLoading,
    watchlist,
    data: stockData,
    stock: currentStock,
    transactions: portfolio,
    transactionLoading: loading.transactionLoading,
    allLoading: loading,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    getNews: () => dispatch(getNews("stocks+finance+business")),
    clearSearch: () => dispatch(clearSearch()),
    getWatchlist: (id) => dispatch(fetchWatchlist(id)),
    fetchStockData: (code) => dispatch(fetchStockData(code)),
    fetchTransactions: (userId,date) => dispatch(fetchTransactions(userId,date)),
    updateChartDisplay: (value) => dispatch(updateChartDisplay(value)),
    fetchTransactionsMain: (userId,date) => dispatch(fetchTransactionsMain(userId,date)),

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Main)

