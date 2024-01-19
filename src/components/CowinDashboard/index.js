import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiConstraints = {
  initial: 'INITIAL',
  in_progress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const CowinDashboard = () => {
  const [apiStatus, setApiStatus] = useState(apiConstraints.initial)
  const [data, setData] = useState({})
  console.log(data)

  useEffect(() => {
    const getData = async () => {
      setApiStatus(apiConstraints.in_progress)
      const response = await fetch(
        'https://apis.ccbp.in/covid-vaccination-data',
      )
      const fetchedData = await response.json()
      if (response.ok === true) {
        setApiStatus(apiConstraints.success)
        setData(fetchedData)
      } else {
        setApiStatus(apiConstraints.failure)
      }
    }
    getData()
  }, [])

  const renderLoadingView = () => (
    <div data-testid="loader" style={{textAlign: 'center'}}>
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  const renderSuccessView = () => (
    <>
      <VaccinationCoverage coverage={data.last_7_days_vaccination} />
      <VaccinationByGender gender={data.vaccination_by_gender} />
      <VaccinationByAge age={data.vaccination_by_age} />
    </>
  )

  const renderFailureView = () => (
    <div style={{textAlign: 'center'}}>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        style={{width: '450px'}}
      />
      <h1 style={{color: '#fff', fontFamily: 'Bree Serif'}}>
        Something Went Wrong
      </h1>
    </div>
  )

  const renderCovidInfo = () => {
    switch (apiStatus) {
      case 'INPROGRESS':
        return renderLoadingView()
      case 'SUCCESS':
        return renderSuccessView()
      case 'FAILURE':
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      <header>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
          className="website-logo"
        />
        <span className="website-name">Co-WIN</span>
      </header>
      <main className="app-body">
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {renderCovidInfo()}
      </main>
    </div>
  )
}

export default CowinDashboard
