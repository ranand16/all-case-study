import { Box, ButtonGroup, Container, Divider, Flex, Heading, Link, Progress, Spacer, Stack, Text } from '@chakra-ui/react';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Link as ReactLink, Route, Routes } from 'react-router-dom';
import CharacterDetails from './Components/CharactersDetails';
import NotFound from './Components/NotFound';
import { STRINGS } from './lang/language';

const CharacterList = lazy(() => import('./Components/CharactersList'));
const Favourites = lazy(() => import('./Components/FavoriteCharacters'));

const App: React.FC = () => {
    return (
        // <ColorSchemeContext>
            <Container paddingY={4}  maxW='container.md'>
                <Stack direction={['column']} spacing={2}>
                    <BrowserRouter future={{
                        v7_startTransition: true
                    }}>
                        <Flex minWidth='max-content' alignItems='center' gap='2'>
                            <Box>
                                <Link as={ReactLink} to="/" style={{ textDecoration: 'none' }}>
                                    <Heading size='lg' bgGradient='linear(to-l, #7928CA, #FF0080)' bgClip='text'>{STRINGS["welcome"]}</Heading>
                                </Link>
                            </Box>
                            <Spacer />
                            <ButtonGroup gap='2' maxWidth={"container.xs"}>
                                {/* <Link as={ReactLink} to="/" color={'Highlight'}><Text>{STRINGS["home"]}</Text></Link> */}
                                <Link as={ReactLink} to="favourites" color={'Highlight'}><Text>{STRINGS["favs"]}</Text></Link>
                            </ButtonGroup>
                        </Flex>
                        <Divider />
                        <Spacer/>
                        <Suspense fallback={<Progress size='xs' isIndeterminate />}>
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
                </Stack>
            </Container>
        // </ColorSchemeContext>
    )
};

export default App;



// const ColorModeProvider = React.createContext<ColorSchemeContextType | null>(null);

// export interface ColorSchemeContextType {
//     colorScheme: string,
//     setNewScheme: (newColorScheme: string)=> void
// }

// interface ComponentNameProps {
//     children: React.ReactNode;
// }


// export const ColorSchemeContext: React.FC = ({ children } : ComponentNameProps) => {
//     const [colorScheme, setColorScheme] = useState('light');

//     const setNewScheme = (colorScheme: string) => {
//         setColorScheme(colorScheme);
//     };
//     return (
//         <ColorModeProvider.Provider value={{colorScheme, setNewScheme}}>
//         {children}
//         </ColorModeProvider.Provider>
//     );
// };