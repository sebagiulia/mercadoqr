import './App.css';
import React, { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LogIn from './LogIn/LogIn.js';
import Register from './Register/Register.js';
import Place from './Place/Place.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHomePage from './userHomePage/UserHomePage.js'
import { Search } from './Search/Search.js'
import tokenServices from './services/tokenServices.js';
import { CreatePlace } from './Place/Create/CreatePlace';
import { AdminPage } from './AdminPage/AdminPage.js' 


library.add(fas, faTwitter, faFontAwesome)

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { click: false }
    this.click = this.click.bind(this);
  }
  click() {
    if (!this.state.click) {
      this.setState({
        click: true
      })
    } else {
      this.setState({
        click: false
      })
    }
  }
  render() {
    if (!this.state.click) {
      return (
        <div className='user'>
          <button onClick={this.click} type="button" className="btn btn-outline-primary rounded-5">
            <FontAwesomeIcon icon="fa-solid fa-user" />
          </button>
        </div>
      );
    } else {
      return (
        <LogIn close={this.click} click={this.state.click} />
      );
    }

  }
}

function VisitantHomePage() {
  return (
    <div id="homepage" className='conteiner-fluid'>
      <div />
      <Search user={null} handlePlace={null} />
      <User />
    </div>
  )
}

function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const tryGetUserData = async () => {
        tokenServices.setToken();
        try {
          const userData = await tokenServices.getUserData();
          if (userData?.user_id) {
            setUser(userData);
          }
          else {
            console.log("no hay token")
          }
        } catch (e) {
          console.error("Error en token" + e);
        }
    }

    tryGetUserData();
  }, []);

  return (
    <div className='vh-100 container-fluid'>
      {user ? <UserHomePage user={user} /> : <VisitantHomePage />}
    </div>

  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/create' element={<CreatePlace />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/:place_name' element={<Place />} />
          <Route path='/:place_name/admin' element={<AdminPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
