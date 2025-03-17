import React, { useState } from 'react';
import './FlightSearch.css';

interface SearchFormData {
  origin: string;
  destination: string;
  departureStartMonth: string;
  departureEndMonth: string;
  tripType: 'one-way' | 'round-trip' | 'multi-city';
  numPassengers: number;
  passengerTypes: {
    adult: number;
    child: number;
    student: number;
  };
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first';
  maxStops: 'any' | 'non-stop' | 'one-stop';
  priceRange: [number, number];
  timePreference: 'any' | 'morning' | 'afternoon' | 'evening' | 'overnight';
  flexibility: 'exact' | 'one-day' | 'three-day' | 'week';
  preferredAirlines: string[];
  loyaltyPrograms: string[];
  baggage: 'none' | 'carry-on' | 'checked';
}

const FlightSearch: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    origin: '',
    destination: '',
    departureStartMonth: '',
    departureEndMonth: '',
    tripType: 'round-trip',
    numPassengers: 1,
    passengerTypes: {
      adult: 1,
      child: 0,
      student: 0,
    },
    cabinClass: 'economy',
    maxStops: 'any',
    priceRange: [0, 2000],
    timePreference: 'any',
    flexibility: 'exact',
    preferredAirlines: [],
    loyaltyPrograms: [],
    baggage: 'carry-on',
  });

  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<null | any[]>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const airlines = [
    'American Airlines', 'Delta', 'United', 'Southwest', 
    'JetBlue', 'Alaska Airlines', 'British Airways', 'Air France',
    'Lufthansa', 'Emirates', 'Qatar Airways', 'Singapore Airlines'
  ];

  const loyaltyPrograms = [
    'AAdvantage', 'SkyMiles', 'MileagePlus', 'Rapid Rewards', 
    'TrueBlue', 'Mileage Plan', 'Executive Club', 'Flying Blue',
    'Miles & More', 'Skywards', 'Privilege Club', 'KrisFlyer'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your ML backend
    // For demo, we'll just set some dummy results
    setSearchResults([
      {
        id: 1,
        origin: searchData.origin,
        destination: searchData.destination,
        price: 329,
        bestTime: 'Book 6 weeks before travel for best prices',
        predictedSavings: '32% below average',
        confidence: 'High (85%)',
        priceHistory: [420, 390, 360, 340, 329, 335, 350],
      }
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSearchData(prev => {
        const parentKey = parent as keyof SearchFormData;
        const parentValue = prev[parentKey];
        
        return {
          ...prev,
          [parent]: {
            ...(parentValue as object),
            [child]: value
          }
        };
      });
    } else {
      setSearchData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePassengerChange = (type: 'adult' | 'child' | 'student', value: number) => {
    if (value < 0) return;
    
    let total = 0;
    for (const key in searchData.passengerTypes) {
      if (key !== type) {
        total += searchData.passengerTypes[key as keyof typeof searchData.passengerTypes];
      }
    }
    
    // Ensure at least 1 passenger and not more than 9 total
    if (total + value >= 1 && total + value <= 9) {
      setSearchData(prev => ({
        ...prev,
        passengerTypes: {
          ...prev.passengerTypes,
          [type]: value
        },
        numPassengers: total + value
      }));
    }
  };

  return (
    <div className="flight-search">
      <div className="search-header">
        <h2>Find the Perfect Time to Book Your Flight</h2>
        <p>Our ML algorithms analyze years of flight data to predict the best time to buy tickets</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="origin">Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                placeholder="City or airport code"
                value={searchData.origin}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group span-2">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="City or airport code"
                value={searchData.destination}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="departureStartMonth">Travel Period (From)</label>
              <select
                id="departureStartMonth"
                name="departureStartMonth"
                value={searchData.departureStartMonth}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="departureEndMonth">Travel Period (To)</label>
              <select
                id="departureEndMonth"
                name="departureEndMonth"
                value={searchData.departureEndMonth}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tripType">Trip Type</label>
              <select
                id="tripType"
                name="tripType"
                value={searchData.tripType}
                onChange={handleInputChange}
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
                <option value="multi-city">Multi-City</option>
              </select>
            </div>

            <div className="form-group">
              <label>Passengers</label>
              <div className="passenger-selector">
                <div className="passenger-type">
                  <span>Adults</span>
                  <div className="number-input">
                    <button type="button" onClick={() => handlePassengerChange('adult', searchData.passengerTypes.adult - 1)}>-</button>
                    <input type="number" value={searchData.passengerTypes.adult} readOnly />
                    <button type="button" onClick={() => handlePassengerChange('adult', searchData.passengerTypes.adult + 1)}>+</button>
                  </div>
                </div>
                <div className="passenger-type">
                  <span>Children</span>
                  <div className="number-input">
                    <button type="button" onClick={() => handlePassengerChange('child', searchData.passengerTypes.child - 1)}>-</button>
                    <input type="number" value={searchData.passengerTypes.child} readOnly />
                    <button type="button" onClick={() => handlePassengerChange('child', searchData.passengerTypes.child + 1)}>+</button>
                  </div>
                </div>
                <div className="passenger-type">
                  <span>Students</span>
                  <div className="number-input">
                    <button type="button" onClick={() => handlePassengerChange('student', searchData.passengerTypes.student - 1)}>-</button>
                    <input type="number" value={searchData.passengerTypes.student} readOnly />
                    <button type="button" onClick={() => handlePassengerChange('student', searchData.passengerTypes.student + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cabinClass">Cabin Class</label>
              <select
                id="cabinClass"
                name="cabinClass"
                value={searchData.cabinClass}
                onChange={handleInputChange}
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxStops">Max Stops</label>
              <select
                id="maxStops"
                name="maxStops"
                value={searchData.maxStops}
                onChange={handleInputChange}
              >
                <option value="any">Any</option>
                <option value="non-stop">Non-stop</option>
                <option value="one-stop">1 stop max</option>
              </select>
            </div>
          </div>

          <button 
            type="button" 
            className="advanced-toggle"
            onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
          >
            {isAdvancedVisible ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>

          {isAdvancedVisible && (
            <div className="advanced-options">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="priceRange">Price Range ($)</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      name="priceRangeMin"
                      min="0"
                      max="10000"
                      value={searchData.priceRange[0]}
                      onChange={(e) => setSearchData(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                      }))}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="priceRangeMax"
                      min="0"
                      max="10000"
                      value={searchData.priceRange[1]}
                      onChange={(e) => setSearchData(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="timePreference">Time of Day</label>
                  <select
                    id="timePreference"
                    name="timePreference"
                    value={searchData.timePreference}
                    onChange={handleInputChange}
                  >
                    <option value="any">Any Time</option>
                    <option value="morning">Morning (6AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-6PM)</option>
                    <option value="evening">Evening (6PM-11PM)</option>
                    <option value="overnight">Overnight (11PM-6AM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="flexibility">Date Flexibility</label>
                  <select
                    id="flexibility"
                    name="flexibility"
                    value={searchData.flexibility}
                    onChange={handleInputChange}
                  >
                    <option value="exact">Exact Dates</option>
                    <option value="one-day">±1 Day</option>
                    <option value="three-day">±3 Days</option>
                    <option value="week">±1 Week</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="baggage">Baggage</label>
                  <select
                    id="baggage"
                    name="baggage"
                    value={searchData.baggage}
                    onChange={handleInputChange}
                  >
                    <option value="none">No Baggage</option>
                    <option value="carry-on">Carry-on Only</option>
                    <option value="checked">Checked Baggage</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredAirlines">Preferred Airlines</label>
                  <select
                    id="preferredAirlines"
                    name="preferredAirlines"
                    multiple
                    value={searchData.preferredAirlines}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setSearchData(prev => ({
                        ...prev,
                        preferredAirlines: values
                      }));
                    }}
                  >
                    {airlines.map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                  <div className="select-help">Hold Ctrl/Cmd to select multiple</div>
                </div>

                <div className="form-group">
                  <label htmlFor="loyaltyPrograms">Loyalty Programs</label>
                  <select
                    id="loyaltyPrograms"
                    name="loyaltyPrograms"
                    multiple
                    value={searchData.loyaltyPrograms}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setSearchData(prev => ({
                        ...prev,
                        loyaltyPrograms: values
                      }));
                    }}
                  >
                    {loyaltyPrograms.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                  <div className="select-help">Hold Ctrl/Cmd to select multiple</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="search-button">Predict Best Time to Buy</button>
        </form>
      </div>

      {searchResults && (
        <div className="search-results">
          <h3>Prediction Results</h3>
          
          {searchResults.map(result => (
            <div key={result.id} className="result-card">
              <div className="result-header">
                <div className="route-info">
                  <h4>{result.origin} to {result.destination}</h4>
                  <div className="current-price">${result.price}</div>
                </div>
              </div>
              
              <div className="prediction-details">
                <div className="prediction-item">
                  <span className="prediction-label">Best Time to Book:</span>
                  <strong className="prediction-value">{result.bestTime}</strong>
                </div>
                
                <div className="prediction-item">
                  <span className="prediction-label">Predicted Savings:</span>
                  <strong className="prediction-value good">{result.predictedSavings}</strong>
                </div>
                
                <div className="prediction-item">
                  <span className="prediction-label">Prediction Confidence:</span>
                  <strong className="prediction-value">{result.confidence}</strong>
                </div>
              </div>
              
              <div className="price-history">
                <h5>Price Trend (Last 7 Days)</h5>
                <div className="chart-placeholder">
                  {/* SVG chart would go here in a real app */}
                  <div className="bar-chart">
                    {result.priceHistory.map((price: number, index: number) => {
                        const maxPrice: number = Math.max(...result.priceHistory);
                        const minPrice: number = Math.min(...result.priceHistory);
                        
                        return (
                            <div 
                                key={index} 
                                className="bar" 
                                style={{ 
                                    height: `${(price / maxPrice) * 100}%`,
                                    backgroundColor: price === minPrice ? '#a777e3' : '#6e8efb'
                                }}
                                title={`$${price}`}
                            ></div>
                        );
                    })}
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="set-alert">Set Price Alert</button>
                <button className="view-details">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;