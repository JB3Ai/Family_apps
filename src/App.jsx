import { FamilyProvider, useFamily } from './contexts/FamilyContext';
import UserSelector from './components/UserSelector';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { currentUser } = useFamily();

  if (!currentUser) {
    return <UserSelector />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <FamilyProvider>
      <AppContent />
    </FamilyProvider>
  );
}
