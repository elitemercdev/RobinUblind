import React from 'react'
import {Link} from 'react-router-dom'

const Greeting = ({ currentUser, logout, demoUser }) => {

  const notLoggedIn = () => {
    return (
      <nav id="navbar" className="login-signup-bar sticky">

        <Link className="home-link-button" to="/main">
        <img className="mainlogo" src={window.logoURL} />

        <span>
          RobinUblind
        </span>
        
        </Link>
        <div className="middle-filler">
          <Link to="/main" className="filler-link">Investing</Link>
          <Link to="/main" className="filler-link">Cash Management</Link>
          <Link to="/main" className="filler-link">Blog</Link>
          <Link to="/main" className="filler-link">Help</Link>
          <button className="demo-user" onClick={demoUser}>Demo User</button>
        </div>
        

        <Link className="login-button"  to="/login">Log in</Link>
        <Link className="sign-up"  to="/signup">Sign Up</Link>
        <div className="flex-box-divider-2"></div>

      </nav>
    )
  }

  const isloggedIn = () => {
    
    return (
      <hgroup id="loggedin-navbar" className="logged-in-nav-bar">

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


        <div className="navbar_logo">
          <Link to="/" className="navbar_logo">
            <img className="navbar_logo" src={window.logoURL} />
          </Link>
        </div>


        <div className="search-bar">
            <input type="text" placeholder=" 🔍 Search"/>
        </div>

        <nav className="navbar">

            



          <div className="dropdown">
            <button className="dropbtn">Account
            </button>

            <div className="dropdown-content">
              <ul>
                <li className="user-email">
                  {currentUser.email}
                </li>
                <li className="user-portfolio">
                  <div>
                    <span>{currentUser.bankroll}</span>
                    <p>Portfolio Value</p>
                  </div>
                  <div className="fix2"></div>
                </li>


                <li>
                  <a href="#">💼 Account</a>
                </li>
                <li>
                  <a href="#">🕑 History</a>
                </li>
                <li className="log-out">
                  <div className="fix"></div>
                  <a href="#" onClick={logout}>↪ Sign Out</a>
                </li>
              </ul>
              
            </div>

          </div>
          <div className="dropdown2">
            <button className="dropbtn2">Notifications
            </button>

            <div className="dropdown-content2">
              <ul>
                <li>
                  <a href="#">Link 1</a>
                </li>
                <li>
                  <a href="#">Link 2</a>
                </li>
                <li>
                  <a href="#">Link 3</a>
                </li>
              </ul>
              
            </div>

          </div>

          
          <Link to="/">Home</Link>

      </nav>

      </hgroup>
    )
  }
  
  return currentUser ? isloggedIn() : notLoggedIn()
}

export default Greeting

  // < button className = "logout-button" onClick = { logout } > Log Out</button >