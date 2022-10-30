import { Container,  Navbar  } from "react-bootstrap"

export function Layout({ children }){
    return (
        <>
         <Navbar className='bg-light shadow-sm px-5'>
            <Container>
                <Navbar.Brand>
                    <h3 className="text-muted">Note</h3>
                </Navbar.Brand>
            </Container>
         </Navbar>
         {children}
        </>
    )
}