import { RouteObject } from 'react-router-dom';
import { AuthPages } from './components/AuthPages';
import { FullProductPage } from './components/FullProductPage';
import { SellerDashboard } from './components/SellerDashboard';
import { OnlineExpo } from './components/OnlineExpo';
import { SponsorshipPage } from './components/SponsorshipPage';
import MarketPage from './routes/market'; // Import the new market page
import App from './App';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'product/:id', element: <FullProductPage /> },
      { path: 'seller-dashboard', element: <SellerDashboard /> },
      { path: 'expo', element: <OnlineExpo /> },
      { path: 'sponsorship', element: <SponsorshipPage /> },
      { path: 'login', element: <AuthPages /> },
      // Add the new dynamic route for individual market pages
      { path: 'market/:marketId', element: <MarketPage /> },
    ],
  },
];

export default routes;
