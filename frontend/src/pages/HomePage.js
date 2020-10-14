import React, { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingButton from '../components/LoadingButton';
import InputGroup from 'react-bootstrap/InputGroup';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function() {
  const [ loading, setLoading ] = useState(false);
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selected, setSelected ] = useState([]);
  const [ submitted, setSubmitted ] = useState(false);
  const history = useHistory();
  const el = useRef(null);

  const handleSearch = useCallback(value => {
    if (value === '') {
      setLoading(false);
      setSuggestions([]);
      return [];
    }

    setLoading(true);
    return fetch(process.env.REACT_APP_API + '/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query:value}),
    })
    .then(response => response.ok && response.json())
    .then(data => {
      if (Array.isArray(data)) {
        setLoading(false);
        setSuggestions(data);
      }
    })
    .catch(err => console.log(err));
  }, [setLoading, setSuggestions]);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    setSubmitted(true);
    if (el.current.state.activeIndex === -1) {
      fetch(process.env.REACT_APP_API + '/search-by-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query : el.current.state.text})
      })
      .then(response => response.ok && response.json())
      .then(data => {
        setSubmitted(false);
        if (data) history.push(`/user/${data._id}`);
      })
    }
    else history.push(`/user/${el.current.state.activeItem._id}`);
  }, [el, history]);

  return (
    <Container fluid="sm" className="h-50 my-5 text-center">
      <Row className="h-100">
        <Col className="p-5 m-auto">
         <div><h1>Ankiboards</h1></div>
         <div><h4>Leaderboards for Anki</h4></div>
          <InputGroup className="p-5">
            <AsyncTypeahead
              ref={el}
              id="User Search"
              delay={100}
              minLength={0}
              labelKey="username"
              isLoading={loading}
              onSearch={handleSearch}
              options={suggestions}
              onChange={(selected) => {setSelected(selected)}}
              onActiveItemChange={item => console.log(item)}
              selected={selected}
              placeholder="Search for a user..."
              onKeyDown={e => {if (e.key === 'Enter') handleSubmit(e)}}
              useCache={false}
            />
            <InputGroup.Append>
              <LoadingButton loaded={!submitted} type="submit" variant={"dark"} onClick={handleSubmit} style={{ minWidth:"80px" }}>
                Search
              </LoadingButton>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  )
}