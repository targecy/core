const URL = 'http://localhost:3090/storage';

// Issuer
export function saveCredential(key: string, value: string): Promise<boolean> {
  // Create an iframe and append it to the DOM
  const iframe = document.createElement('iframe');
  iframe.src = URL;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  console.log('iframe', iframe);

  // Send a message to the iframe once it's loaded
  return new Promise((resolve, reject) => {
    iframe.onload = function () {
      try {
        const data = {
          action: 'save',
          key: key,
          value: value,
        };

        console.log('sending');
        iframe.contentWindow?.postMessage(data, URL);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
  });
}

// Publisher
export function retrieveCredential(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    // Create an iframe and append it to the DOM
    const iframe = document.createElement('iframe');
    iframe.src = URL;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Listen for messages from the iframe
    function messageListener(event: MessageEvent) {
      if (event.origin !== URL) return;

      if (event.data.action === 'data') {
        resolve(event.data.value);
        window.removeEventListener('message', messageListener);
      }
    }

    window.addEventListener('message', messageListener);

    // Request data from the iframe once it's loaded
    iframe.onload = function () {
      const data = {
        action: 'get',
        key: key,
      };
      iframe.contentWindow?.postMessage(data, URL);
    };
  });
}
