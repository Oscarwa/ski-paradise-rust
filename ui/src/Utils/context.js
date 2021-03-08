import React, { useState } from 'react';

const SkiContext = React.createContext('ski');

const SkiContextProvider = (props) => {
    const [user, setUser] = useState(null);
    
    const val = {
        user,
        setUser,
    }
    return (
        <SkiContext.Provider value={ val }>
            { props.children }
        </SkiContext.Provider>
    );
}

export { 
    SkiContext, 
    SkiContextProvider
};