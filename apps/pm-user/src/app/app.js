import { Route, Routes, Link } from 'react-router-dom';
import { LoginForm } from '../components'; // importing from components
import { Skeleton } from '@pm/pm-ui'; // importing from pm-ui library
import { reader } from '@pm/pm-business'; // importing from pm-business (utility) library
export function App() {
  const output = reader();
  return (
    <>
      <LoginForm />
      <Skeleton variant="text" />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={118} />
      <span>{output}</span>
    </>
  );
}
export default App;
