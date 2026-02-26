import { AppRoutes } from '@app/router/appRoutes';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';

function App() {
  return (
    <>
      <Header />

      <main className="main">
        <nav></nav>
        <section className="content">
          <AppRoutes />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
