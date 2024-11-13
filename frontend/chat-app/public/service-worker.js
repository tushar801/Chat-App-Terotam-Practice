self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.notification.title;
  const options = {
    body: data.notification.body
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
