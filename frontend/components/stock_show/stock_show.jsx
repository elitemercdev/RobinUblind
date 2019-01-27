import React from 'react'
import { Link } from 'react-router-dom'
import Header from "../header/header_container"
import Loading from '../loading_page/loading_page'


const StockShowPage = ({ news, stock, loading }) => {

  if (loading.newsLoading || loading.stockLoading) {
    debugger
    return <Loading/>
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
            window.onscroll = function () { myFunction() };
            var navbar = document.getElementById("watchlist");
            var sticky = navbar.offsetTop;

            function myFunction() {
              if (window.pageYOffset >= sticky) {
                navbar.classList.add("wsticky")
              } else {
                navbar.classList.remove("wsticky");
              }
            }
          })}

        </script>


      </header>
      <div className="entire-main-body">



        <div className="porfolio-performance">
          <h1>$0.00</h1>
          <h2>$0.00 (0.00%)<span>Today</span></h2>
        </div>

        <div className="porfolio-chart">
          <h1>Chart goes here</h1>
        </div>
        {/* 22 Articles in here */}
        <div className="news-list">
          <h1>Recent News</h1>
          <ul>
            {news}
          </ul>

        </div>




        <div id='watchlist stock-buy' className="watch-list wsticky">
          <h2>
            Buy <div>{stock.quote.symbol}</div>
          </h2>
          <span></span>
          <ul>
          </ul>
        </div>

      </div>

    </div>
  )
}

export default StockShowPage
