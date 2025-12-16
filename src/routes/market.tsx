import { Route } from 'react-router-dom';
import { Market } from '../components/Market';

export const marketRoutes = (
  <>
    <Route path="/market/:id" element={<Market />} />
  </>
);
