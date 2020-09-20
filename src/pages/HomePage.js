import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function() {
  const [ query, setQuery ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ suggestions, setSuggestions ] = useState([]);
  const [ selected, setSelected ] = useState([]);
  const history = useHistory();

  const handleSearch = (value) => {
    setLoading(true);
    setQuery(value);
    if (value === '') return [];
    fetch(process.env.REACT_APP_API + '/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query:value}),
    })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(data => {
      console.log(data);
      setSuggestions(data);
      setLoading(false);
    })
    .catch(err => console.log(err));
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (selected.length > 0) return history.push(`/users/${(selected[0]._id)}`);
    console.log("User not found");
  }

  return (
    <Container fluid className="h-50 d-flex flex-column align-items-center justify-content-center">
      <Row><Col><h1>Ankiboards</h1></Col></Row>
      <Row><Col><h4>Leaderboards for Anki</h4></Col></Row>
      <Row className="my-5">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <InputGroup>
                <AsyncTypeahead
                  open={query != '' && suggestions.length > 0 && selected.length == 0}
                  id="User Search"
                  delay={0}
                  minLength={3}
                  labelKey="username"
                  isLoading={loading}
                  onSearch={handleSearch}
                  options={suggestions}
                  onChange={(selected) => {setSelected(selected)}}
                  selected={selected}
                  placeholder="Search for a user..."
                  highlightOnlyResult
                  useCache={false}
                  onInputChange={(text, event) => {if (text==='') setQuery('')}} // Hooks don't call onSearch for some reason...
                  renderMenuItemChildren={(option, props) => (
                    <span>{option.username}</span>
                  )}
                />
                <InputGroup.Append>
                    <Button type="submit" variant="outline-primary">
                      Search
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