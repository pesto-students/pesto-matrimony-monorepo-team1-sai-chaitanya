import { Route, Routes, Link } from 'react-router-dom';
import { LoginForm } from '../components'; // importing from components
import { Skeleton } from '@pm/pm-ui'; // importing from pm-ui library
import { reader } from '@pm/pm-business'; // importing from pm-business (utility) library
export function App() {
  const output = reader();
  return (
    <>
      <LoginForm />
      <Skeleton />
      <span>{output}</span>
    </>
  );
}
export default App;
