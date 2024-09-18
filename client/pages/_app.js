import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';



const AppComponent = ({ Component, pageProps, currentUser }) => {
    console.log(pageProps);
    
   return (
    <div className="container">
        <Header currentUser={currentUser} />
        <Component {...pageProps} currentUser={currentUser} />
    </div>
   ) 
}

AppComponent.getInitialProps = async ({ ctx,Component }) => {
    try {
        const client = buildClient(ctx.req)
        const { data } = await client.get('/api/users/currentuser');
        let pageProps;
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx ,client,data.currentUser); 
        }
        return {
            pageProps,
            ...data
        }
    } catch (error) {
        console.log(error);

    }
}

export default AppComponent;