import React, { PureComponent } from 'react'
import Container from 'react-bootstrap/Container'
import { convert } from 'tabletojson'
import sortBy from 'lodash/sortBy'

import './App.css'

import ReservationsTable from './ReservationsTable'

export default class App extends PureComponent {
  state = {
    login: false,
    readingLogin: true,
    reservations: [],
    readingReservations: true
  }

  componentDidMount() {
    fetch('/api/reservations')
      .then(response => response.text())
      .then(body => {
        this.handleReservationsBody(body)
      }).catch(() => {
        this.setState({
          login: false,
          readingLogin: false,
          readingReservations: false
        })
      })
  }

  handleReservationsBody = html => {
    const rootHtml = '<table id="reservations-table"'

    if (html.indexOf && html.indexOf(rootHtml) !== -1) {
      this.setState({
        login: true,
        readingLogin: false,
        reservations: this.parseReservations(html.substring(html.indexOf(rootHtml), html.length))
      })
    } else {
      this.setState({
        login: false,
        readingLogin: false
      })
    }
  }

  parseReservations = html => {
    const convertedTables = convert(html)
    if (!convertedTables.length) return null

    const rawReservations = convertedTables[0]
    const formattedReservations = rawReservations.map(r => ({
      id: `${r['Päivä']}-${r['Aika']}`,
      day: r['Päivä'],
      timeslot: r['Aika'],
      user: r['Varaaja']
    }))

    return sortBy(formattedReservations, ['day', 'timeslot'])
  }

  login = (username, password) => {
    let formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    fetch('/api/login', { body: formData, method: 'POST' })
      .then(response => response.text())
      .then(body => {
        this.handleReservationsBody(body)
      }).catch(() => {
        this.setState({
          login: false,
          readingLogin: false,
          readingReservations: false
        })
      })
  }

  render() {
    window.a = this

    const {
      login,
      readingLogin,
      reservations
    } = this.state

    if (readingLogin) {
      return <p>Ladataan...</p>
    }

    if (!login) {
      return <h1>Kirjaudu</h1>
    }

    return (
      <Container>
        <ReservationsTable reservations={ reservations || [] }/>
      </Container>
    )
  }
}
