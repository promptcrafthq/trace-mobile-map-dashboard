import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !GOOGLE_MAPS_API_KEY) {
  console.error('❌ Missing environment variables. Ensure all Firebase and Google Maps keys are set.');
  throw new Error('Required environment variables are not set.');
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'weatherLeads'), (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      setEvents(docs);
    });
    return () => unsub();
  }, []);

  return (
    <div className="h-screen w-screen">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={{ lat: 30.221, lng: -92.019 }}
          zoom={7}
        >
          {events.map(event => (
            <Marker
              key={event.id}
              position={{ lat: event.lat, lng: event.lon }}
              label={event.eventType?.[0]?.toUpperCase() || 'E'}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
