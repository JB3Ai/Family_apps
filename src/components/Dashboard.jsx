import { useFamily } from '../contexts/FamilyContext';
import ScheduleCard from './ScheduleCard';
import ShoppingList from './ShoppingList';
import MoodBoard from './MoodBoard';
import ContactVisit from './ContactVisit';
import NotesSection from './NotesSection';
import PhotoAlbum from './PhotoAlbum';
import { LogOut, AlertCircle, Calendar as CalIcon, Mail, Download } from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';
import { format, startOfWeek, addDays } from 'date-fns';

export default function Dashboard() {
  const { currentUser, USERS, logout, CALENDAR_ID, moods, shoppingList, notes, setTheme } = useFamily();

  const user = Object.values(USERS).find(u => u.id === currentUser);
  const isSunday = new Date().getDay() === 0;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleEmailReport = () => {
    const recipients = 'jono@jonoblackburn.com,sueblackburn@absamail.co.za,sambookings@hotmail.co.uk';
    const subject = `Family Sync Weekly Report - ${format(new Date(), 'dd MMM yyyy')}`;

    // Format Moods for current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));

    let moodReport = "WEEKLY MOOD REPORT:\n";
    weekDays.forEach(day => {
      if (moods[day]) {
        moodReport += `${day}: ${JSON.stringify(moods[day])}\n`;
      }
    });

    // Format Shopping List
    let shopReport = "\nKIDS' SHOPPING LIST:\n";
    if (shoppingList.length === 0) shopReport += "No items needed.\n";
    else {
      shoppingList.forEach(item => {
        shopReport += `- [${item.done ? 'x' : ' '}] ${item.text} (by ${item.addedBy})\n`;
      });
    }

    // Notes
    let notesReport = `\nFAMILY NOTES:\n${notes || "No notes."}\n`;

    const body = encodeURIComponent(
      `Hi Everyone,\n\nHere is the weekly update from Family Sync!\n\n` +
      `REMINDER: Please log in to update next week's School Collection times.\n\n` +
      `----------------------------------------\n` +
      moodReport +
      `----------------------------------------\n` +
      shopReport +
      `----------------------------------------\n` +
      notesReport +
      `\nSee you purely for coordination,\nFamily Sync App`
    );

    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="animate-fade-in">
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', background: '-webkit-linear-gradient(45deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Family Sync
            </h1>
            <img src="/jb3ai-logo.png" alt="Logo" style={{ height: '50px', opacity: 1 }} />
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {format(new Date(), 'EEEE, MMMM do')}
          </span>

          {/* Theme Switcher */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => handleThemeChange('dark')}
              className="btn-icon"
              title="Dark Neon Mode"
              style={{
                width: '24px', height: '24px', padding: 0,
                borderRadius: '50%', background: '#0f172a', border: '2px solid #22d3ee', cursor: 'pointer'
              }}
            />
            <button
              onClick={() => handleThemeChange('light')}
              className="btn-icon"
              title="Light Mode"
              style={{
                width: '24px', height: '24px', padding: 0,
                borderRadius: '50%', background: '#f7f8fa', border: '2px solid #ddd', cursor: 'pointer'
              }}
            />
            <button
              onClick={() => handleThemeChange('pastel')}
              className="btn-icon"
              title="Pastel Mode"
              style={{
                width: '24px', height: '24px', padding: 0,
                borderRadius: '50%', background: '#fdf2f8', border: '2px solid #f9a8d4', cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 400px)': { display: 'block' } }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: user?.color }}>Active</div>
          </div>
          <button
            onClick={logout}
            className="btn-icon"
            style={{ background: '#fee2e2', color: '#ef4444' }}
            title="Switch User"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {isSunday && (
        <div style={{
          background: '#fff7ed',
          borderLeft: '4px solid #f97316',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'start',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <AlertCircle className="theme-mom" />
            <div>
              <div style={{ fontWeight: '700', color: '#9a3412' }}>Sunday Reminder!</div>
              <div style={{ color: '#c2410c', fontSize: '14px' }}>Don't forget to update the schedule and shopping list.</div>
            </div>
          </div>
          <button
            onClick={handleEmailReport}
            className="btn-primary"
            style={{ marginTop: '12px', background: '#ea580c' }}
          >
            <Mail size={18} /> Send Weekly Report Now
          </button>
        </div>
      )
      }

      {
        !isSunday && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleEmailReport} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} /> Send Weekly Email
            </button>
          </div>
        )
      }

      <ScheduleCard />

      <ShoppingList />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <ContactVisit />
        <MoodBoard />
      </div>

      <NotesSection />

      <div style={{ marginTop: '20px' }}></div>

      <PhotoAlbum />

      <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <CalIcon size={16} />
          <span>Linked Calendar ID:</span>
        </div>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=c_9225dbf1d64c129f04d8ec499c70776a843d14fd5b96d4b704c5339c884c3007%40group.calendar.google.com&ctz=Africa%2FJohannesburg"
            style={{ border: 0, width: '100%', height: '600px' }}
            frameBorder="0"
            scrolling="no"
            title="Family Calendar"
          ></iframe>
        </div>
      </div>
      <PWAInstallButton />
    </div >
  );
}
