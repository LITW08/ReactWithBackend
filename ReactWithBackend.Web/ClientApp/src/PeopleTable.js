import React from 'react';
import axios from 'axios';
import PersonRow from './PersonRow.js';
import AddPersonForm from './AddPersonForm.js';


class PeopleTable extends React.Component {

    state = {
        people: [],
        person: {
            firstName: '',
            lastName: '',
            age: ''
        },
        isAdding: false,
        hideTable: false
    }

    componentDidMount = () => {
        axios.get('/api/people/getall').then(({ data }) => {
            this.setState({ people: data });
        });
    }

    onTextChange = e => {
        const personCopy = { ...this.state.person };
        personCopy[e.target.name] = e.target.value;
        this.setState({ person: personCopy });
    }

    onAddClick = () => {
        this.setState({ isAdding: true });
        axios.post('/api/people/add', this.state.person).then(() => {
            axios.get('/api/people/getall').then(({ data }) => {
                this.setState({
                    people: data,
                    person: { firstName: '', lastName: '', age: '' },
                    isAdding: false
                });
            });
        });

    }

    onHideTableChange = () => {
        const { hideTable } = this.state;
        this.setState({ hideTable: !hideTable });
    }

    render() {
        const { people, person, isAdding, hideTable } = this.state;
        const { firstName, lastName, age } = person;
        return (
            <div className="container" style={{ marginTop: 60 }}>
                <AddPersonForm
                    isAdding={isAdding}
                    firstName={firstName}
                    lastName={lastName}
                    age={age}
                    onFirstNameChange={this.onTextChange}
                    onLastNameChange={this.onTextChange}
                    onAgeChange={this.onTextChange}
                    onAddClick={this.onAddClick}
                />
                <div className="row mt-4">
                    <div className="col-md-2">
                        <div className="form-check">
                            <input checked={hideTable} onChange={this.onHideTableChange} type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">Hide Table</label>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12">
                        {!hideTable && <table className="table table-header table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!people.length && <h1>Loading....</h1>}
                                {!!people.length && people.map(p => <PersonRow person={p} key={p.id} />)}
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default PeopleTable;