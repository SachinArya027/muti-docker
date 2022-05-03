import axios from 'axios';
import { useEffect, useState } from 'react';

const initialState = {
    seenIndexes: [],
    values: {},
    index: ''
};

const Fib = () => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        async function fetchValues() {
            const { data: values } = await axios.get('/api/values/current');
            setState((prevState) => ({ ...prevState, values }));
        }

        async function fetchIndexes() {
            const { data: seenIndexes } = await axios.get('/api/values/all');
            setState((prevState) => ({ ...prevState, seenIndexes }));
        }

        fetchValues();
        fetchIndexes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('/api/values', {
            index: state.index
        });

        setState((prevState) => ({ ...prevState, index: '' }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index: </label>
                <input
                    value={state.index}
                    onChange={(e) =>
                        setState((prevState) => ({
                            ...prevState,
                            index: e.target.value
                        }))
                    }
                />
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {state.seenIndexes.map(({ number }) => number).join(', ')}

            <h3>Calculated Values:</h3>
            {Object.keys(state.values).map((key, idx) => (
                <div key={idx}>
                    For index {key} I calculated {state.values[key]}
                </div>
            ))}
        </div>
    );
};

export default Fib;
