import React, { Component } from 'react'
import { Input, Header, Loader, Flag, Button, Transition, Table } from 'semantic-ui-react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import axios from 'axios'
import { Map } from './components/Map'
import './App.css'

// colors for slices of pie charts
const COLORS = ['#890000', '#fc7474', '#c1c1c1', '#000000']

// constants to simplify flag country lookup
const US = 'united states'
const BRAZIL = 'brazil'
const IRELAND = 'ireland'

// urls for mma disipline icons
const MUAY_THAI = 'https://d30y9cdsu7xlg0.cloudfront.net/png/681149-200.png'
const WRESTLING = 'https://d30y9cdsu7xlg0.cloudfront.net/png/533252-200.png'
const JIU_JITSU = 'https://d30y9cdsu7xlg0.cloudfront.net/png/643352-200.png'
const HEART = 'https://d30y9cdsu7xlg0.cloudfront.net/png/296460-200.png'
const MY_BELIEF = 'https://d30y9cdsu7xlg0.cloudfront.net/png/1553406-200.png'

class App extends Component {
  
  state = {
    fighters: [],
    searchText: '',
    filteredFighters: [],
    fighterDetails: null,
    winData: [],
    lossData: [],
    expand: false,
    thumbnail: null,
    coordinates: null
  }
  
  componentDidMount = async () => {
    const response = await axios.get('/api/fighters')
    this.setState({ fighters: response.data })
  }
  
  handleChange = (e,d) => this.setState({ searchText: d.value })
  
  handleSearch = e => {
    const { fighters, searchText } = this.state
    if(e.keyCode === 13) {
      const filteredFighters = fighters.filter(f => {
        const fullName = `${f.first_name} ${f.last_name}` 
        return fullName.toLowerCase().includes(searchText.toLowerCase())
      })
      this.setState({ filteredFighters })
    }
  }
  
  handleFighter = async (name, thumbnail) => {
    await this.setState({ loading: true })
    const response = await axios({
      method: 'post',
      url: '/api/fighter',
      data: { name }
    })
    const winData = [
      { name: 'Knockouts', value: response.data.wins.knockouts },
      { name: 'Submissions', value: response.data.wins.submissions },
      { name: 'Decisions', value: response.data.wins.decisions },
      { name: 'Others', value: response.data.wins.others }
    ]
    const lossData = [
      { name: 'Knockouts', value: response.data.losses.knockouts },
      { name: 'Submissions', value: response.data.losses.submissions },
      { name: 'Decisions', value: response.data.losses.decisions },
      { name: 'Others', value: response.data.losses.others }
      ]
    await this.setState({ 
      loading: false, 
      fighterDetails: response.data, 
      winData, 
      lossData, 
      thumbnail,
      coordinates: response.data.coordinates
    })
  }
  
  handleExpand = () => this.setState({ expand: !this.state.expand })
  
  handleNationality = (c) => {
    switch(c.toLowerCase()) {
      case US:
        return 'us'
      case BRAZIL:
        return 'br'
      case IRELAND:
        return 'ie'
      default:
        return null
    }
  }
  
  handleSkill = (s) => {
    switch(s.toLowerCase()) {
      case 'wrestling':
        return WRESTLING
      case 'muay thai':
        return MUAY_THAI
      case 'jiu-jitsu':
        return JIU_JITSU
      case 'heart':
      case 'huge heart':
        return HEART
      case 'my belief':
        return MY_BELIEF
      default:
        return null
    }
  }
  
  render() {
    const { filteredFighters, searchText, fighterDetails, loading, winData, lossData, expand, thumbnail, coordinates } = this.state
    return (
      <div>
        <br/>
        <Header as='h1' textAlign='center'>UFC React Tutorial App</Header>
        <div className='main-container'>
          <div>
            <div className='search-container'>
              <Input 
                className='search-input' 
                icon='search' 
                placeholder='Search...' 
                size='large' 
                onChange={this.handleChange}
                onKeyUp={this.handleSearch}
                value={searchText}
              />
            </div>
            <div className='all-results'>
              {filteredFighters && filteredFighters.map((f,i) => (
                <div key={`fighter-item-${i}`} className='single-result' onClick={() => this.handleFighter(`${f.first_name} ${f.last_name}`, f.thumbnail)}>
                  <Header as='h2' className='result-name'>{`${f.first_name} ${f.last_name}`}</Header>
                  <img className='result-thumbnail' src={f.thumbnail} alt='fighter thumbnail'/>
                </div>
              ))}
            </div>
        </div>
        <div>
            <Loader size='massive' active={loading} />
            {fighterDetails && <div>
              <img className='info-thumbnail' src={thumbnail} alt='fighter'/>
              <p>Name:  <strong>{fighterDetails.name}</strong></p>
              <p>Nickname:  <strong>{fighterDetails.nickname || 'N/A'}</strong></p>
              <p>Record:  <strong>{fighterDetails.record || 'N/A'}</strong>&nbsp;
                <Button onClick={this.handleExpand}>{expand ? 'Hide ' : 'Show '}Record Charts</Button>
              </p>
              <Transition visible={expand} animation='slide up'>
                <div>
                  <div className='chart'>
                    <Header as='h3'>Wins</Header>
                    <PieChart height={250} width={400}>
                      <Pie data={winData} dataKey='value'>
                        {winData.map((entry, index) => (<Cell key={`wins-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                      </Pie>
                      <Tooltip/>
                      <Legend/>
                    </PieChart>
                  </div>
                  <div className='chart'>
                    <Header as='h3'>Losses</Header>
                    <PieChart height={250} width={400}>
                      <Pie data={lossData} dataKey='value'>
                        {lossData.map((entry, index) => (<Cell  key={`wins-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                      </Pie>
                      <Tooltip/>
                      <Legend/>
                    </PieChart>
                  </div>
                </div>
              </Transition>
              <p>Gym/Team: <strong>{fighterDetails.association}</strong></p>
              <div className='table-container'>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Age</Table.HeaderCell>
                      <Table.HeaderCell>Height</Table.HeaderCell>
                      <Table.HeaderCell>Weight</Table.HeaderCell>
                      <Table.HeaderCell>Weight Class</Table.HeaderCell>
                      <Table.HeaderCell>Nationality</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{fighterDetails.age}</Table.Cell>
                      <Table.Cell>{fighterDetails.height}</Table.Cell>
                      <Table.Cell>{fighterDetails.weight} lbs</Table.Cell>
                      <Table.Cell>{fighterDetails.weight_class}</Table.Cell>
                      <Table.Cell>
                        {fighterDetails.nationality} &nbsp;
                        <Flag name={this.handleNationality(fighterDetails.nationality)}/>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
              <div>
                <div className='attributes'>
                  {fighterDetails.summary.map((s,i) => (
                    <div key={`skill-item-${i}`} className='skill'>
                      <p>{s}</p>
                      <img src={this.handleSkill(s)} alt='no icon' className='skill-image'/>
                    </div>
                  ))}
                </div>
              </div>
              {coordinates &&
              <div className='map'>
                <Map isMarkerShown center={coordinates}/>
              </div>}
          </div>}
        </div>
      </div>
    </div>
    )
  }
}

export default App
