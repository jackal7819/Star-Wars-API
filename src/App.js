import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMoviesHanlder = useCallback(async () => {
        setIsloading(true);
        setError(null);
        try {
            const response = await fetch(
                'https://star-wars-api-b48a7-default-rtdb.europe-west1.firebasedatabase.app/movies.json'
            );
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const data = await response.json();

            const loadedMovies = [];

            for (const key in data) {
                loadedMovies.push({
                    id: key,
                    title: data[key].title,
                    openingText: data[key].openingText,
                    releaseDate: data[key].releaseDate,
                })
            }

            setMovies(loadedMovies);
        } catch (error) {
            setError(error.message);
        }
        setIsloading(false);
    }, []);

    useEffect(() => {
        fetchMoviesHanlder();
    }, [fetchMoviesHanlder]);

    const addMovieHandler = async (movie) => {
        const response = await fetch(
            'https://star-wars-api-b48a7-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
            {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const data = await response.json();
        console.log(data);
    };

    let content = <p>Found no movies</p>;

    if (movies.length > 0) {
        content = <MoviesList movies={movies} />;
    }

    if (error) {
        content = <p>{error}</p>;
    }

    if (isLoading) {
        content = <p>Loading...</p>;
    }

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMoviesHanlder}>Fetch Movies</button>
            </section>
            <section>{content}</section>
        </React.Fragment>
    );
}

export default App;
