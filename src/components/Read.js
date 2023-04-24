import { useState, useEffect } from 'react';
import './Read.css';

function Read() {
    const [data, setData] = useState([]);
    const [queryType, setQueryType] = useState('name');
    const [nameQuery, setNameQuery] = useState('');
    const [lastNameQuery, setLastNameQuery] = useState('');
    const [professionQuery, setProfessionQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [locationType, setLocationType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isQuerying, setIsQuerying] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsQuerying(true);
                let response = null;

                if (queryType === 'name') {
                    response = await fetch(`http://localhost:8080/users/name?firstName=${nameQuery}&lastName=${lastNameQuery}`);
                } else if (queryType === 'profession') {
                    response = await fetch(`http://localhost:8080/users/profession?profession=${professionQuery}`);
                } else if (queryType === 'location') {
                    const locationQueryParam = locationType === 'country' ? `country=${locationQuery}` : `city=${locationQuery}`;
                    response = await fetch(`http://localhost:8080/users/byLocation?${locationQueryParam}`);
                } else if (queryType === 'date') {
                    response = await fetch(`http://localhost:8080/users/date-range?startDate=${startDate}&endDate=${endDate}`);
                }
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setIsQuerying(false);
            }
        }

        if (isQuerying) {
            fetchData();
        }
    }, [isQuerying]);

    function handleQueryButtonClick() {
        setIsQuerying(true);
    }

    return (
        <div>
            <h1>Read Users</h1>
            <div>
                <label>
                    Query By:
                    <select value={queryType} onChange={(e) => setQueryType(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="profession">Profession</option>
                        <option value="location">Location</option>
                        <option value="date">Date Range</option>
                    </select>
                </label>
                <br />
                {queryType === 'name' && (
                    <>
                        <label>
                            First Name:
                            <input type="text" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" value={lastNameQuery} onChange={(e) => setLastNameQuery(e.target.value)} />
                        </label>
                    </>
                )}
                {queryType === 'profession' && (
                    <label>
                        Profession:
                        <input type="text" value={professionQuery} onChange={(e) => setProfessionQuery(e.target.value)} />
                    </label>
                )}
                {queryType === 'location' && (
                    <div>
                        <label>
                            Location:
                            <select value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                                <option value="country">Country</option>
                                <option value="city">City</option>
                            </select>
                        </label>
                        <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
                    </div>
                )}
                {queryType === 'date' && (
                    <>
                        <label>
                            Start Date:
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </label>
                        <label>
                            End Date:
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </label>
                    </>
                )}
            </div>
            <button onClick={handleQueryButtonClick}>Query</button>
            <div style={{ height: "420px", overflowY: "scroll" }}>
                <div className="items-container">
                    {Array.isArray(data) &&
                        data.map((item) => (
                            <div className="item" key={item.id}>
                                <p>{item.firstName} {item.lastName}</p>
                                <p>{item.email}</p>
                                <p>{item.profession}</p>
                                <p>{item.dateCreated}</p>
                                <p>{item.country}, {item.city}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Read;