import { useEffect, useState } from 'react';

const StoragePage = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    // Listen for messages
    window.addEventListener('message', function (event) {
      // Validate origin
      // if (event.origin !== 'https://publisher.com' && event.origin !== 'https://webapp2.com') return;
      if (event.data.target.includes("metamask")) return;

      console.log('received event', event);
      if (event.data.action === 'save') {
        // Save data to local storage
        console.log('saving event!');
        localStorage.setItem(event.data.key, event.data.value);
      } else if (event.data.action === 'get') {
        // Retrieve data from local storage
        const data = localStorage.getItem(event.data.key);
        // Send data back
        event.source?.postMessage({ action: 'data', value: data }, { targetOrigin: event.origin });
      }

      setInitialized(true);
    });
  });

  return <div>Storage</div>;
};

export default StoragePage;
