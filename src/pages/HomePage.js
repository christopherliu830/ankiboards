import React, { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function() {
  const [ loading, setLoading ] = useState(false);
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selected, setSelected ] = useState([]);
  const [ error, setError ] = useState('');
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
      setLoading(false);
      setSuggestions(data);
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
        setTimeout(() => {
          setSubmitted(false);
          if (data) history.push(`/user/${data._id}`);
          else setError("User not found");
        }, 400);
      })
    }
    else history.push(`/user/${el.current.state.activeItem._id}`);
  }, [el, history]);

  const handleInputChange = useCallback(() => {
    setError('');
    if (el.current.state.text !== '') setLoading(true);
    else setLoading(false);
  }, [el, setLoading]);

  return (
    <Container fluid className="h-50 d-flex flex-column align-items-center justify-content-center">
      <Row><Col><h1>Ankiboards</h1></Col></Row>
      <Row><Col><h4>Leaderboards for Anki</h4></Col></Row>
      <Row className="py-5">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              {<Form.Text className="text-danger pb-3" style={{height:'2em'}}>{error ? error: ' '}{error && <br/>}</Form.Text>}
              <InputGroup>
                <AsyncTypeahead
                  ref={el}
                  id="User Search"
                  delay={100}
                  minLength={1}
                  labelKey="username"
                  isLoading={loading}
                  onSearch={handleSearch}
                  options={suggestions}
                  onChange={(selected) => {setSelected(selected)}}
                  onActiveItemChange={item => console.log(item)}
                  selected={selected}
                  placeholder="Search for a user..."
                  onKeyDown={e => {if (e.key === 'Enter') handleSubmit(e)}}
                  onInputChange={handleInputChange}
                  useCache={false}
                />
                <InputGroup.Append>
                    <Button type="submit" variant={"dark"} style={{ minWidth:"80px" }}disabled={submitted}>
                      {submitted ? <Spinner as="span" animation="border" size="sm" role="status"/> : 'Search'}
                    </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}