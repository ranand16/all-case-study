import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CharacterDetails from './Components/CharactersDetails';
import NotFound from './Components/NotFound';

const CharacterList = lazy(() => import('./Components/CharactersList'));
const Favourites = lazy(() => import('./Components/FavoriteCharacters'));

const App: React.FC = () => (
    <>
        <h1>Welcome to react app</h1>
        <BrowserRouter>
            <ul>
                <li><Link to="/">Home of star wars</Link></li>
                <li><Link to="favourites">Favourites</Link></li>
            </ul>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<CharacterList />} />
                    <Route path="details">
                        <Route path=":id" element={<CharacterDetails/>}></Route>
                    </Route>
                    <Route path="favourites" element={<Favourites />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </>
);

export default App;