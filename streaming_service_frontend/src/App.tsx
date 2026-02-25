import { ErrorBoundary } from '@app/components/error-boundary';
import { AppRoutes } from '@app/router/appRoutes';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';

function App() {
    return (
        <ErrorBoundary>
            <Header />
            <AppRoutes />
            <Footer />
        </ErrorBoundary>
    );
}

export default App;
