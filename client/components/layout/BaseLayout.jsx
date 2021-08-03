import React from 'react'
import Header from '../Header'

const BaseLayout = ({children, currentUser }) => {
    console.log(currentUser);
    return (
        <div>
            <Header currentUser={currentUser} />
            {children}
        </div>

    )
}



export default BaseLayout;